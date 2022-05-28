<template>
    <div class="mx-3 my-3 mainDiv" v-if="!showResumo">
        <div class="float-right mr-3">
          <b-row>
            <b-col class="text-nowrap my-2">
              <b-button block @click="goHome">Outra Carteira</b-button>
            </b-col>
            <b-col class="text-nowrap my-2">
              <b-button block variant="success" @click="showModalCalculo">Calcular Resumo</b-button>
            </b-col>
          </b-row>
        </div>
        <h1 class="text-left">Transações</h1>
        <b-row class="line">
            <b-col md="2" sm="6" class="my-2">
                <b-form-select v-model="action" :options="options"></b-form-select>
            </b-col>
            <b-col id="data" md="2" sm="6" class="colorText my-2 pl-0 text-nowrap">
                <span class="mr-1" v-if="dataOperacao">{{new Date(dataOperacao + " 00:00").toLocaleDateString('pt-BR', {year: 'numeric', month: 'numeric', day: 'numeric'})}}</span>
                <span class="mr-1" v-else> Data </span>
                <b-form-datepicker id="example-datepicker" v-model="dataOperacao" placeholder="Data" button-only locale="pt-BR"></b-form-datepicker>
            </b-col>
            <b-col md="2" sm="6" class="my-2">
                <b-form-input v-model="nomeMoeda" placeholder="Moeda"></b-form-input>
            </b-col>
            <b-col md="2" sm="6" class="my-2">
                <b-form-input v-model="valorOperacao" placeholder="Valor Operação"></b-form-input>
            </b-col>
            <b-col md="2" sm="6" class="my-2">
                <b-form-input v-model="quantidadeMoeda" placeholder="Quantidade Moeda"></b-form-input>
            </b-col>
            <b-col md="2" sm="6" class="my-2">
                <b-button variant="success" block @click="confirmarNovaTransacao">Incluir</b-button>
            </b-col>
        </b-row>
        <b-row class="line colorText my-1" v-for="(transaction, index) in allTransactions" :key=index>
              <b-col md="2" sm="6" class="my-2" v-show="!transaction.isEditing">
                  {{transaction.transactionName}}
              </b-col>
              <b-col md="2" sm="6" class="my-2" v-show="!transaction.isEditing">
                  {{new Date(transaction.transactionDate + " 00:00:00").toLocaleDateString("pt-BR")}}
              </b-col>
              <b-col md="2" sm="6" class="my-2" v-show="!transaction.isEditing">
                  {{transaction.nameCurrency}}
              </b-col>
              <b-col md="2" sm="6" class="my-2" v-show="!transaction.isEditing">
                  {{transaction.amountInvested.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}}
              </b-col>
              <b-col md="2" sm="6" class="my-2" v-show="!transaction.isEditing">
                  {{transaction.currencyQuantity}}
              </b-col>
              <b-col md="2" sm="6" class="my-2" v-show="!transaction.isEditing">
                <b-dropdown id="dropdown-1" text="Opções">
                  <b-dropdown-item @click="editar(transaction)">Alterar</b-dropdown-item>
                  <b-dropdown-item @click="showConfirmation(transaction)" variant="danger">Excluir</b-dropdown-item>
                </b-dropdown>
              </b-col>



              <b-col md="2" sm="6" class="my-2" v-show="transaction.isEditing">
                <b-form-select v-model="transactionEdit.action" :options="options"></b-form-select>
              </b-col>
              <b-col id="data" md="2" sm="6" class="colorText my-2 pl-0 text-nowrap" v-show="transaction.isEditing">
                <span class="mr-1" v-if="transactionEdit.dataOperacao">{{new Date(transactionEdit.dataOperacao + " 00:00").toLocaleDateString('pt-BR', {year: 'numeric', month: 'numeric', day: 'numeric'})}}</span>
                <span class="mr-1" v-else> Data </span>
                <b-form-datepicker id="example-datepicker" v-model="transactionEdit.dataOperacao" placeholder="Data" button-only locale="pt-BR"></b-form-datepicker>
              </b-col>
              <b-col md="2" sm="6" class="my-2" v-show="transaction.isEditing">
                <b-form-input v-model="transactionEdit.nomeMoeda" placeholder="Moeda"></b-form-input>
              </b-col>
              <b-col md="2" sm="6" class="my-2" v-show="transaction.isEditing">
                <b-form-input v-model="transactionEdit.valorOperacao" placeholder="Valor Operação"></b-form-input>
              </b-col>
              <b-col md="2" sm="6" class="my-2" v-show="transaction.isEditing">
                <b-form-input v-model="transactionEdit.quantidadeMoeda" placeholder="Quantidade Moeda"></b-form-input>
              </b-col>
              <b-col md="2" sm="6" class="my-2" v-show="transaction.isEditing">
                <b-dropdown id="dropdown-2" text="Opções">
                  <b-dropdown-item @click="confirmarEdicao(transaction)" variant="success">Confirmar</b-dropdown-item>
                  <b-dropdown-item @click="cancelarEdicao(transaction)" variant="danger">Cancelar</b-dropdown-item>
                </b-dropdown>
              </b-col>
        </b-row>
        <b-modal ref="confirmationModal" hide-footer hide-header>
          <div class="d-block text-center">
            <h3>Tem certeza que deseja deletar essa transação?</h3>
          </div>
          <b-button class="mt-3" variant="outline-success" block @click="confirmDelete">Sim</b-button>
          <b-button class="mt-3" variant="outline-danger" block @click="cancelDelete">Cancelar</b-button>
        </b-modal>
        <b-modal ref="calcularModal" hide-footer hide-header>
          <div class="d-block text-center">
            <h3>Selecione o ano para o cálculo</h3>
            <b-form-select v-model="year" :options="yearOptions"></b-form-select>
          </div>
          <b-button class="mt-3" variant="outline-success" block @click="confirmCalculo">Calcular</b-button>
          <b-button class="mt-3" variant="outline-danger" block @click="hideModalCalculo">Cancelar</b-button>
        </b-modal>
        <b-modal ref="erroModal" hide-footer hide-header>
          <div class="d-block text-center">
            <h3>{{errorMsg}}</h3>
          </div>
          <b-button class="mt-3" variant="outline-success" block @click="hideModalErro">Ok</b-button>
        </b-modal>
    </div>
    <div class="mx-3 my-3" v-else>
      <h1 class="text-left">Resumo {{this.year}}</h1>
      <b-card v-for="(month,index) in allMonths" :key="index"
          border-variant="success"
          header-bg-variant="#2c3e50"
          header-class= "monthHeader"
          class="month my-2"
          header-text-variant="white"
          align="center"
          body-class="monthBody">
          <template #header>
            <h6 class="mb-0 text-left">Período - {{month.mes}}</h6>
          </template>
          <b-card-text>
              <div class="py-0 text-left" v-if="month.temDebito">
                Deve ser gerado um Darf no valor de {{month.valorDebito.toLocaleString('pt-BR', {
                                                      style: 'currency',
                                                      currency: 'BRL',
                                                    })}}
                reais, referentes ao mês de {{month.mes}}.<br>
                Com prazo de vencimento até a data {{new Date(month.dataExpiracao).toLocaleDateString('pt-BR', {year: 'numeric', month: 'numeric', day: 'numeric'})}}.<br>
                Volume negociado no período de {{month.volumeVenda.toLocaleString('pt-BR', {
                                                  style: 'currency',
                                                  currency: 'BRL',
                                                })}}
                reais, Saldo Mensal de <span v-if="month.balanco > 0" class="text-success"> 
                                          + {{month.balanco.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                          })}}
                                      </span>
                                      <span v-else class="text-danger"> 
                                          - {{month.balanco.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                          })}}
                                      </span> reais.
              </div>
              <div class="py-0 text-left" v-else-if="month.balanco < 0">
                Isento. Prejuízo de <span class="text-danger"> 
                                          - {{month.balanco.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                          })}}
                                      </span> reais.
              </div>
              <div class="py-0 text-left" v-else-if="month.volumeVenda > 0">
                Isento. Volume de venda de {{month.volumeVenda.toLocaleString('pt-BR', {
                                                  style: 'currency',
                                                  currency: 'BRL',
                                                })}} inferior a cota mínima de R$ 35.000,00 reais.
              </div>
              <div class="py-0 text-left" v-else>
                Nenhuma transação de venda.
              </div>
            </b-card-text>
      </b-card>
    </div>
</template>

<script>
// eslint-disable-next-line
import axios from 'axios';
import authHeader from '../services/auth-header';
  export default {
    name: 'CarteiraAberta',
    data() {
      return {
        walletId: this.$route.params.walletId,
        allTransactions: [],
        loadingTransactions: false,
        transactionDelete: {},
        action: 1,
        dataOperacao: "",
        nomeMoeda: "",
        valorOperacao: "",
        quantidadeMoeda: "",
        options: [
          { value: 1, text: 'Compra' },
          { value: 2, text: 'Venda' },
        ],  
        year: new Date().getFullYear(),
        showResumo: false,
        transactionEdit: {},
        allMonths: [],
        errorMsg: ""
      }
    },
    created() {
        this.carregarTransacoes();
    },
    mounted() {
        var list = document.getElementsByClassName("form-control");
        for (var i = 0; i < list.length; i++) {
            console.log(list[i].classList.add("text-nowrap"));
        }
    },
    methods: {
      addOrUpdateTransaction(transaction) { 
          return transaction;
      },
      showModal() {
        this.$refs['confirmationModal'].show();
      },
      hideModal() {
        this.$refs['confirmationModal'].hide();
      },
      showModalCalculo() {
        this.$refs['calcularModal'].show();
      },
      hideModalCalculo() {
        this.$refs['calcularModal'].hide();
      },
      showModalErro() {
        this.$refs['erroModal'].show();
      },
      hideModalErro() {
        this.$refs['erroModal'].hide();
      },
      handleError(error) {
        console.log(error);
        const statusCode = error.response ? error.response.status : null;
        if (statusCode === 403) {
          this.$store.dispatch('auth/logout').then(
            () => {
              this.$router.push('/');
            }
          );
        }
        else if (statusCode === 500) {
          this.errorMsg = error.response?.data?.message?.split("Exception: ")[1];
          this.showModalErro();
        }
      },
      confirmarNovaTransacao() {
        axios.post('transaction', JSON.stringify(
            {
                "transactionStatusId": this.action,
                "transactionDate": this.dataOperacao,
                "nameCurrency": this.nomeMoeda,
                "amountInvested": this.valorOperacao,
                "currencyQuantity": this.quantidadeMoeda,
                "walletId": this.walletId
            }
          ), { headers: authHeader() })
          .then(() => {
            this.carregarTransacoes();
          })
          .catch(error => {
            this.handleError(error);
          })
          .finally(() => {
              
          });
      },
      carregarTransacoes() {
        this.loadingTransactions = true;
        axios.get(`transaction/wallet/${this.walletId}`, { headers: authHeader() })
          .then(response => {
            this.allTransactions = response.data;
          })
          .catch((error) => {
            console.log(error);
            const statusCode = error.response ? error.response.status : null;
            if (statusCode === 403) {
              this.$store.dispatch('auth/logout').then(
                () => {
                  this.$router.push('/');
                }
              );
            }
          })
          .finally(() => {
            this.loadingTransactions = false;
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
      deletarTransacao() {
        axios.delete(`transaction/${this.transactionDelete.id}`, { headers: authHeader() })
          .then(() => {
            this.allTransactions.splice(this.allTransactions.findIndex(x => x.id == this.transactionDelete.id), 1);
          })
          .catch((error) => {
            this.handleError(error);
          })
          .finally(() => {
            this.loadingWallets = false;
          });
      },
      showConfirmation(transaction) {
        this.$refs['confirmationModal'].show();
        this.transactionDelete = transaction;
      },
      cancelDelete() {
        this.$refs['confirmationModal'].hide();
        this.transactionDelete = {};
      },
      confirmDelete() {
        this.$refs['confirmationModal'].hide();
        this.deletarTransacao();
      },
      goHome () {
        this.$router.push("/home");
      },
      editar(transaction) {
        if (this.transactionEdit.id) {
          var trans = this.allTransactions.find(x => x.id == this.transactionEdit.id);
          trans.isEditing = false;
        }

        transaction.isEditing = true;
        this.$nextTick(() => {
          this.$set(this, "transactionEdit", {});
          this.$set(this.transactionEdit, "action", transaction.transactionName == "COMPRA" ? 1 : 2);
          this.$set(this.transactionEdit, "id", transaction.id);
          this.$set(this.transactionEdit, "dataOperacao", transaction.transactionDate);
          this.$set(this.transactionEdit, "nomeMoeda", transaction.nameCurrency);
          this.$set(this.transactionEdit, "valorOperacao", transaction.amountInvested);
          this.$set(this.transactionEdit, "quantidadeMoeda", transaction.currencyQuantity);

        });
      },
      cancelarEdicao(transaction) {
        this.transactionEdit = {};
        transaction.isEditing = false;
      },
      confirmarEdicao(transaction) {
        axios.put(`transaction/${transaction.id}`, JSON.stringify(
            {
                "transactionStatusId": this.transactionEdit.action,
                "transactionDate": this.transactionEdit.dataOperacao,
                "nameCurrency": this.transactionEdit.nomeMoeda,
                "amountInvested": this.transactionEdit.valorOperacao,
                "currencyQuantity": this.transactionEdit.quantidadeMoeda,
                "walletId": this.transactionEdit.walletId
            }), { headers: authHeader() })
          .then(() => {
            this.carregarTransacoes();
          })
          .catch((error) => {
            this.handleError(error);
          })
          .finally(() => {
            this.cancelarEdicao(transaction);
          });
      },
      confirmCalculo() {
        axios.get(`darf/${this.walletId}/wallet/${this.year}/year`, { headers: authHeader() })
          .then((response) => {
            this.showResumo = true;
            this.allMonths = response.data;
          })
          .catch((error) => {
            console.log(error);
            const statusCode = error.response ? error.response.status : null;
            if (statusCode === 403) {
              this.$store.dispatch('auth/logout').then(
                () => {
                  this.$router.push('/');
                }
              );
            }
          })
          .finally(() => {
            
          });
      }
    },
    computed: {
      yearOptions() {
        var initialyear = new Date().getFullYear();
        var allYears = [];
        for (let index = 0; index < 13; index++) {
          allYears.push({
            text: initialyear - index, value: initialyear - index
          })          
        }
        return allYears;
      }
    }
}
</script>

<style scoped>
.line{
    background-color: #2c3e50;
    padding: 1px 1px 1px 1px;
    margin-left: 4px;
    margin-right: 4px;
    border-radius: 1rem;
    align-items: center;
    font-size: larger;
}

.colorText {
    color: #f2f2f2;
}

.monthHeader {
  background-color: #2c3e50;
  color: #2c3e50;
  font-weight: 700;
}

.month {
  min-width: 12rem;
}

.month:hover {
  background-color: #354d64;
  color: #f2f2f2;
}

.monthBody {
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

.mainDiv {
  overflow: auto;
  max-height: 45rem;
  min-height: 30rem;
}
</style>