const app = Vue.createApp({
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false,
      showLoginForm: false,
      showRegisterForm: false,
      showProducts: false,
      showCart: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: ''
      },
      users: [],
      products: [
        {
          id: 1,
          name: 'Counter-Strike: Global Offensive',
          price: 'R$ 76,49',
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg?t=1683566799',
          editing: false
        },
        {
          id: 2,
          name: 'FIFA 23',
          price: 'R$ 299,00',
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1811260/header.jpg?t=1682117049',
          editing: false
        },
        {
          id: 3,
          name: 'Cyberpunk 2077',
          price: 'R$ 99,95',
          image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg?t=1686834071',
          editing: false
        }
      ],
      cart: []
    };
  },
  created() {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      this.users.push(JSON.parse(adminUser));
    }
  },
  methods: {
    toggleLoginForm() {
      this.showLoginForm = !this.showLoginForm;
      this.showRegisterForm = false;
      this.clearForms();
    },
    toggleRegisterForm() {
      this.showRegisterForm = !this.showRegisterForm;
      this.showLoginForm = false;
      this.clearForms();
    },
    toggleProducts() {
      this.showProducts = !this.showProducts;
      this.showCart = false;
    },
    toggleCart() {
      this.showCart = !this.showCart;
      this.showProducts = false;
    },
    login() {
      const { username, password } = this.loginForm;
      const user = this.users.find(
        (user) => user.username === username && user.password === password
      );
      if (user) {
        this.isLoggedIn = true;
        this.isAdmin = username === 'admin';
        this.showLoginForm = false;
        this.clearForms();
      } else {
        alert('Usuário ou senha incorretos.');
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.clearForms();
    },
    register() {
      const { username, password } = this.registerForm;
      const userExists = this.users.some((user) => user.username === username);
      if (userExists) {
        alert('Nome de usuário já está em uso.');
      } else {
        this.users.push({ username, password });
        if (username === 'admin' && password === 'admin') {
          localStorage.setItem('adminUser', JSON.stringify({ username, password }));
        }
        this.showRegisterForm = false;
        alert('Registro realizado com sucesso. Faça login para continuar.');
        this.clearForms();
      }
    },
    addToCart(product) {
      if (this.isLoggedIn) {
        const cartItem = this.cart.find(
          (item) => item.product.id === product.id
        );
        if (cartItem) {
          cartItem.quantity++;
        } else {
          this.cart.push({ product, quantity: 1 });
        }
      } else {
        alert('Faça login ou registre-se para adicionar ao carrinho.');
        this.showLoginForm = true;
      }
    },
    removeFromCart(cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      } else {
        const index = this.cart.findIndex(
          (item) => item.product.id === cartItem.product.id
        );
        if (index !== -1) {
          this.cart.splice(index, 1);
        }
      }
    },
    clearForms() {
      this.loginForm.username = '';
      this.loginForm.password = '';
      this.registerForm.username = '';
      this.registerForm.password = '';
    },
    goToHomePage() {
      window.location.href = '/';
    },
    editProduct(product) {
      if (this.isLoggedIn && this.isAdmin) {
        product.editing = true;
      } else {
        alert('Apenas o usuário admin tem permissão para editar produtos.');
      }
    },
    saveProduct(product) {
      product.editing = false;
      console.log('Produto editado:', product);
    },
    cancelEdit(product) {
      product.editing = false;
    },
    removeProduct(product) {
      if (this.isLoggedIn && this.isAdmin) {
        const index = this.products.findIndex(
          (item) => item.id === product.id
        );
        if (index !== -1) {
          this.products.splice(index, 1);
        }
      } else {
        alert('Apenas o usuário admin tem permissão para excluir produtos.');
      }
    },
    getTotalPrice() {
      return this.cart.reduce((total, item) => {
        const price = parseFloat(item.product.price.replace('R$', '').replace(',', '.'));
        return total + price * item.quantity;
      }, 0);
    },
    finalizarCompra() {
      if (this.cart.length === 0) {
        alert('Seu carrinho está vazio. Adicione itens antes de finalizar a compra.');
        return;
      }
      const total = this.getTotalPrice();
      alert(`Total da compra: R$ ${total.toFixed(2)}`);
      const formaPagamento = prompt('Selecione a forma de pagamento (Digite o número):\n1. Cartão de Crédito\n2. Boleto\n3. Transferência Bancária');
      if (formaPagamento === '1') {
        alert('Você selecionou Cartão de Crédito. Redirecionando para a página de pagamento...');
      } else if (formaPagamento === '2') {
        alert('Você selecionou Boleto. Aguarde o boleto ser gerado...');
      } else if (formaPagamento === '3') {
        alert('Você selecionou Transferência Bancária. Aguarde as instruções para realizar a transferência...');
      } else {
        alert('Forma de pagamento inválida.');
      }
    }
  }
});

app.mount('#app');
