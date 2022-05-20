<template>
    <div class="mx-3 my-3">
        <b-card-group columns v-for="(walletList,index) in walletDivisions" :key="index">
            <div v-for="(wallet,index2) in walletList" :key="index2">
                <b-card @click="addOrUpdateWallet(wallet)"
                    border-variant="success"
                    header-bg-variant="#2c3e50"
                    header-class= "walletHeader"
                    class="wallet my-2"
                    header-text-variant="white"
                    align="center"
                    body-class="walletBody">
                    <template #header>
                      <span v-if="wallet.name != 'Nova Carteira'" :id="'spDelete_' + index + '_' + index2" class="float-right" @click.stop.prevent="showConfirmation(wallet)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2-fill align-baseline" viewBox="0 0 16 16">
                          <path d="M2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/>
                        </svg>
                      </span>
                      <b-tooltip v-if="wallet.name != 'Nova Carteira'" :target="'spDelete_' + index + '_' + index2" title="Tooltip title" triggers="hover">
                        Deletar Carteira.
                      </b-tooltip>
                      <h6 class="mb-0">{{wallet.name}}</h6>
                    </template>
                    <b-card-text v-if="wallet.name != 'Nova Carteira'">
                        <div class="py-4 text-center" v-if="!wallet.walletCurrency[0]">
                          Carteira Vazia.
                        </div>
                        <ul v-else>
                            Maiores Posições
                            <li v-for="(coin,index3) in formatHoldings(wallet)" :key="index3">
                                {{coin.currency.name}} {{coin.percent.toFixed(2)}}%
                            </li>
                        </ul>
                    </b-card-text>
                    <div v-else-if="showInputCarteira">
                      <div class="d-flex flex-column align-items-center">
                        <div class="mb-2 w-75 inputsDinamicos">
                          <span class="d-flex flex-start pl-2">Nome:</span>
                          <b-form-input v-model="nomeCarteira"></b-form-input>
                        </div>
                        <b-button id="buttonCriarCarteira" variant="outline-primary" class="w-25 inputsDinamicos buttonMain" @click="confirmarNovaCarteira">Confirmar</b-button>
                      </div>
                    </div>
                    <div class="text-center py-4" v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                      </svg>
                    </div>
                </b-card>
            </div>
        </b-card-group>
        <b-modal ref="confirmationModal" hide-footer hide-header>
          <div class="d-block text-center">
            <h3>Tem certeza que deseja deletar essa carteira?.</h3>
          </div>
          <b-button class="mt-3" variant="outline-danger" block @click="cancelDelete">Cancelar</b-button>
          <b-button class="mt-3" variant="outline-success" block @click="confirmDelete">Sim</b-button>
        </b-modal>
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
        allWallets: [],
        loadingWallets: false,
        walletDelete: {}
      }
    },
    created() {
      this.carregarCarteiras();
    },
    methods: {
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
        .catch(error => {
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
      axios.get(`wallet/${this.$store.state.auth.user.id}/userId`, { headers: authHeader() })
        .then(response => {
          this.allWallets = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loadingWallets = false;
        });
    },
    formatHoldings(wallet) {
      var totalAux = 0;
      wallet.walletCurrency.forEach(coin => {
        coin.totalValue = coin.averagePrice * coin.quantity;
        totalAux += coin.totalValue;
      });
      wallet.walletCurrency.forEach(coin => {
        coin.percent = ((coin.totalValue * 100) / totalAux);
      });
      
      return wallet.walletCurrency.slice().sort((x, y) => x.percent < y.percent ? 1 : -1).slice(0, 3);
    },
    deletarCarteira() {
      axios.delete(`wallet/${this.walletDelete.id}`, { headers: authHeader() })
        .then(() => {
          this.allWallets.splice(this.allWallets.findIndex(x => x.id == this.walletDelete.id), 1);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loadingWallets = false;
        });
    },
    showConfirmation(wallet) {
      this.$refs['confirmationModal'].show();
      this.walletDelete = wallet;
    },
    cancelDelete() {
      this.$refs['confirmationModal'].hide();
      this.walletDelete = {};
    },
    confirmDelete() {
      this.$refs['confirmationModal'].hide();
      this.deletarCarteira();
    }
  },
  computed: {
    walletDivisions() {
        var aux = 0;
        var newLista = [];
        var listOfLists = [];
        var newWallet = {name: "Nova Carteira"};

        if(!this.allWallets.length) {
          newLista.push(newWallet);
          listOfLists.push(newLista);
        }

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
          this.carregarCarteiras();
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
  min-height: 13rem;
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
  min-width: 11rem;
  max-width: 25rem;
}
</style>