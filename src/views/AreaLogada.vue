<template>
    <div class="mx-3 my-3">
        <b-card-group columns v-for="(walletList,index) in walletDivisions" :key="index">
            <div v-for="(wallet,index2) in walletList" :key="index2">
                <b-card @click="addOrUpdateWallet(wallet)"
                    border-variant="success"
                    :header="wallet.name"
                    header-bg-variant="#2c3e50"
                    header-class= "walletHeader"
                    class="wallet my-2"
                    header-text-variant="white"
                    align="center"
                    body-class="walletBody">
                    <b-card-text v-if="wallet.name != 'Nova Carteira'">Maiores Posições
                        <ul>
                            <li>
                                Bitcoin 39%;
                            </li>
                            <li>
                                Ethereum 39%;
                            </li>
                            <li>
                                Luna 23%;
                            </li>
                        </ul>
                    </b-card-text>
                    <div v-else-if="showInputCarteira">
                      <div class="d-flex flex-column align-items-center">
                        <div class="mb-2 w-25 inputsDinamicos">
                          <span class="d-flex flex-start pl-2">Nome:</span>
                          <b-form-input v-model="nomeCarteira"></b-form-input>
                        </div>
                        <b-button id="buttonCriarCarteira" variant="outline-primary" class="w-25 inputsDinamicos buttonMain" @click="confirmarNovaCarteira">Confirmar</b-button>
                      </div>
                    </div>
                    <div class="text-center py-2" v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                      </svg>
                    </div>
                </b-card>
            </div>
        </b-card-group>
    </div>
</template>

<script>
// eslint-disable-next-line
import axios from 'axios';
import authHeader from '../services/auth-header';
  export default {
    name: 'AreaLogada',
    data() {
      return {
        nomeCarteira: '',
        showInputCarteira: false,
        stateCadastro: {Nome: null, Sobrenome: null, Email: null},
        loading: false,
        allWallets: [{name: "Primeira Carteira"}, {name: "sapo"}, {name: "poder"}],
        loadingWallets: false
      }
    },
    methods: {
      logar() {
        this.message = "";
        this.loading = true;
        this.$store.dispatch('auth/login', JSON.stringify(
            {
              email: this.email,
              password: this.senha
            }
          )).then(
            () => {
              this.loading = false;
              this.$router.push('/home');
            },
            error => {
              this.loading = false;
              this.message = error?.toString() + " - " + error.response?.data[0]?.message;
            }
          );
      },
      addOrUpdateWallet(wallet) { 
          if (wallet.name == "Nova Carteira") {
            this.showInputCarteira = true;
          }
          else {
            alert("Carregar Detalhes");
          }
      },
      showModal() {
        this.$refs['my-modal'].show();
      },
      hideModal() {
        this.$refs['my-modal'].hide();
      },
      msgSenha() {
        var msg = [];
        if(this.senhasNaoBatem || this.senhaMenor) {
            if(this.senhasNaoBatem) {
              msg.push("As senhas não batem.");
            }
            if(this.senhaMenor) {
              msg.push("A senha tem de ser maior que 4 caracteres.");
            }
          }
        return msg;
    },
    resetCadastro() {
      this.stateCadastro = {Nome: null, Sobrenome: null, Email: null};
      this.nome = this.sobrenome = this.email = this.senha = this.confirmacaoSenha = "";
    },
    voltarLogin() {
      this.showCadastro = !this.showCadastro;
      this.message = "";
    },
    confirmarNovaCarteira() {
      let that = this;
      axios.post('wallet', JSON.stringify(
          {
            "userId": this.$store.state.auth.user.id,
            "name": this.nomeCarteira
          }
        ), { headers: authHeader() })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
        .finally(() => {
          that.nomeCarteira = "";
          that.showInputCarteira = false;
          that.carregarCarteiras();
        });
    },
    carregarCarteiras() {
      this.loadingWallets = true;
      axios.get(`wallet/${this.$store.state.auth.user.id}`, { headers: authHeader() })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(response => {
            this.allWallets = response;
        })
        .then(() => {
          this.loadingWallets = false;
        });
    }
  },
  computed: {
    walletDivisions() {
        var aux = 0;
        var newLista = [];
        var listOfLists = [];
        var newWallet = {name: "Nova Carteira"};
        this.allWallets.forEach(wallet => {
            aux ++;
            newLista.push(wallet);

            if (aux == this.allWallets.length) {
                if (newLista.length < 3) {
                    newLista.push(newWallet);
                }
                else {
                    listOfLists.push(newLista);
                    newLista = [];
                    newLista.push(newWallet);
                }
                listOfLists.push(newLista);
            }
            else if (aux % 3 == 0) {
                listOfLists.push(newLista);
                newLista = [];
            }
        });

      return listOfLists;
    },
    listaMsg() {
      return this.msgSenha();
    }
  },
  watch: { // eslint-disable-next-line
      '$route' (to, from) {
          alert("Carregar Carteiras");
      }
  }
}
</script>

<style scoped>
.walletHeader {
  background-color: #2c3e50;
  color: #2c3e50;
  font-weight: 700;
}

.wallet {
  min-width: 12rem;
  max-width: 25rem;
  min-height: 10rem;
}

.wallet:hover {
  background-color: #354d64;
  color: #f2f2f2;
  cursor: pointer;
}

.walletBody {
    text-align: left;
}

.buttonMain {
  background-color: #8EFF58;
  color: #2c3e50;
  font-weight: 700;
}

.buttonMain:hover {
  background-color: #b4ff51;
}

.inputsDinamicos {
  min-width: 19rem;
  max-width: 25rem;
}
</style>