<template>
  <div v-if="passwordRecoveryCode === undefined">
    <h1>Bem vindo ao</h1>
    <img alt="Safi Logo" src="@/assets/safiLogo.png" class="img-fluid">
    <div>
      <b-spinner v-if="loading" label="Carregando" class=""></b-spinner>
      <div v-else-if="message">
        <div class="form-group">
          <div v-if="message" class="text-danger" role="alert">{{message}}</div>
        </div>
      </div>
      <template v-if="!loading">
        <div class="d-flex flex-column align-items-center" v-if="!showCadastro && !showEsqueci">
          <div class="mb-2 w-25 inputsDinamicos">
            <span class="d-flex flex-start pl-2">Email:</span>
            <b-form-input v-model="email" placeholder="exemplo@email.com.br"></b-form-input>
          </div>
          <div class="mb-2 w-25 inputsDinamicos">
            <span class="d-flex flex-start pl-2">Senha:</span>
            <b-form-input v-model="senha" placeholder="************" type="password"></b-form-input>
          </div>
            <b-button v-if="!showCadastro && !showEsqueci" id="buttonLogin" variant="outline-primary" class="w-25 inputsDinamicos buttonMain" @click="logar">Entrar</b-button>
          <div class="d-flex flex-column align-items-center" v-if="!showCadastro && !showEsqueci">
            <b-button id="buttonEsqueciSenha" variant="link" class="w-25 inputsDinamicos mt-2" @click="showEsqueci = !showEsqueci">Esqueci minha senha</b-button>
            <b-button id="buttonCadastro" variant="link" class="w-25 inputsDinamicos" @click="showCadastro = !showCadastro">Ainda não sou cadastrado</b-button>
          </div>
        </div>

        <div class="d-flex flex-column align-items-center" v-else-if="showEsqueci">
          <div class="mb-2 w-25 inputsDinamicos">
            <span class="d-flex flex-start pl-2">Email:</span>
            <b-form-input v-model="email" placeholder="exemplo@email.com.br"></b-form-input>
          </div>
          <b-button id="buttonLogin" variant="outline-primary" class="w-25 inputsDinamicos buttonMain" @click="logar">Enviar Email</b-button>
          <b-button id="buttonVoltar" variant="link" class="w-25 inputsDinamicos mt-2" @click="voltarLoginSenha">Voltar ao Login</b-button>
        </div>

        <div class="d-flex flex-column align-items-center" v-else-if="showCadastro && !showEsqueci">
          <div class="mb-2 w-25 inputsDinamicos">
            <span class="d-flex flex-start pl-2">Nome:</span>
            <b-form-input v-model="nome" placeholder="Primeiro Nome" :state="stateCadastro.Nome"></b-form-input>
          </div>
          <div class="mb-2 w-25 inputsDinamicos">
            <span class="d-flex flex-start pl-2">Sobrenome:</span>
            <b-form-input v-model="sobrenome" placeholder="Sobrenome" :state="stateCadastro.Sobrenome"></b-form-input>
          </div>
          <div class="mb-2 w-25 inputsDinamicos">
            <span class="d-flex flex-start pl-2">Email:</span>
            <b-form-input v-model="email" placeholder="exemplo@email.com.br" :state="stateCadastro.Email"></b-form-input>
          </div>
          <div class="mb-2 w-25 inputsDinamicos">
            <span class="d-flex flex-start pl-2">Senha:
              <b-icon id="spSenha" v-show="(senhasNaoBatem || senhaMenor) && senhaInvalida" icon="exclamation-lg" variant="warning"></b-icon>
            </span>
            <b-form-input v-model="senha" placeholder="************" type="password"></b-form-input>
          </div>
          <b-popover target="spSenha" triggers="hover" placement="auto" variant="warning">
            <template #title>Senha Inválida</template>
            <span v-for="(message,index) in listaMsg" :key="index">{{message}}<br></span>
          </b-popover>
          <div class="mb-2 w-25 inputsDinamicos">
            <span class="d-flex flex-start pl-2">Confirme a Senha:
              <b-icon id="spSenha2" v-show="(senhasNaoBatem || senhaMenor) && senhaInvalida" v-b-popover="'Popover inside a modal!'" icon="exclamation-lg" variant="warning"></b-icon>
            </span>
            <b-form-input v-model="confirmacaoSenha" placeholder="************" type="password"></b-form-input>
          </div>
          <b-popover target="spSenha2" triggers="hover" placement="auto" variant="warning">
            <template #title>Senha Inválida</template>
            <span v-for="(message,index) in listaMsg" :key="index">{{message}}<br></span>
          </b-popover>
          <b-button id="buttonCadastrar" variant="outline-primary" class="w-25 inputsDinamicos buttonMain" @click="cadastrar">Cadastrar</b-button>
          <b-button id="buttonVoltar" variant="link" class="w-25 inputsDinamicos mt-2" @click="voltarLogin">Voltar ao Login</b-button>
        </div>
      </template>
      <b-modal ref="my-modal" hide-footer hide-header>
        <div class="d-block text-center">
          <h3>Operação Realizada Com Sucesso!<br>Confirme o email para continuar.<br>Fique atento a caixa de spam.</h3>
        </div>
        <b-button class="mt-3" variant="outline-success" block @click="hideModal">Ok</b-button>
      </b-modal>
    </div>
  </div>
  <div v-else>
    <h1>Recuperação de senha</h1>
    <img alt="Safi Logo" src="@/assets/safiLogo.png" class="img-fluid">
    <div>
      <div class="d-flex flex-column align-items-center">
        <div class="mb-2 w-25 inputsDinamicos">
          <span class="d-flex flex-start pl-2">Senha:
            <b-icon id="spSenha" v-show="(senhasNaoBatem || senhaMenor) && senhaInvalida" icon="exclamation-lg" variant="warning"></b-icon>
          </span>
          <b-form-input v-model="senha" placeholder="************" type="password"></b-form-input>
        </div>
        <b-popover target="spSenha" triggers="hover" placement="auto" variant="warning">
          <template #title>Senha Inválida</template>
          <span v-for="(message,index) in listaMsg" :key="index">{{message}}<br></span>
        </b-popover>
        <div class="mb-2 w-25 inputsDinamicos">
          <span class="d-flex flex-start pl-2">Confirme a Senha:
            <b-icon id="spSenha2" v-show="(senhasNaoBatem || senhaMenor) && senhaInvalida" v-b-popover="'Popover inside a modal!'" icon="exclamation-lg" variant="warning"></b-icon>
          </span>
          <b-form-input v-model="confirmacaoSenha" placeholder="************" type="password"></b-form-input>
        </div>
        <b-popover target="spSenha2" triggers="hover" placement="auto" variant="warning">
          <template #title>Senha Inválida</template>
          <span v-for="(message,index) in listaMsg" :key="index">{{message}}<br></span>
        </b-popover>
        <b-button id="buttonRecuperarSenha" variant="outline-primary" class="w-25 inputsDinamicos buttonMain" @click="recover">Alterar Senha</b-button>
      </div>
      <b-modal ref="my-modal" hide-footer hide-header>
        <div class="d-block text-center">
          <h3>Senha Alterada Com Sucesso! Realize login para continuar.</h3>
        </div>
        <b-button class="mt-3" variant="outline-success" block @click="hideModal">Ok</b-button>
      </b-modal>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LoginView',
    data() {
      return {
        email: '',
        senha: '',
        nome: '',
        sobrenome: '',
        confirmacaoSenha: '',
        showEsqueci: false,
        showCadastro: false,
        senhaInvalida: false,
        stateCadastro: {Nome: null, Sobrenome: null, Email: null},
        loading: false,
        message: '',
        passwordRecoveryCode: this.$route.params.passwordRecoveryCode
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
      cadastrar () {
        this.message = "";
        var valido = true;
        if(!this.nome) {
          this.stateCadastro.Nome = false;
          valido = false;
        }
        else {
          this.stateCadastro.Nome = true;
        }
        if(!this.sobrenome) {
          this.stateCadastro.Sobrenome = false;
          valido = false;
        }
        else {
          this.stateCadastro.Sobrenome = true;
        }
        if(!this.email) {
          this.stateCadastro.Email = false;
          valido = false;
        }
        else {
          this.stateCadastro.Email = true;
        }
        if(this.senhasNaoBatem || this.senhaMenor) {
          this.senhaInvalida = true
          valido = false;
        }
        if(valido) {
          this.loading = true;
          this.$store.dispatch('auth/register', JSON.stringify(
            {
              firstName: this.nome,
              lastName: this.sobrenome,
              email: this.email,
              password: this.senha
            }
          )).then(
            () => {
              this.loading = false;
              this.showModal();
            },
            error => {
              this.loading = false;
              this.message = error?.toString() + " - " + error.response?.data[0]?.message;
            }
          );
        }
      },
      recover () {
        this.message = "";
        var valido = true;
        
        if(this.senhasNaoBatem || this.senhaMenor) {
          this.senhaInvalida = true
          valido = false;
        }
        if(valido) {
          this.loading = true;
          this.$store.dispatch('auth/recover', JSON.stringify(
            {
              code: this.passwordRecoveryCode,
              password: this.senha
            }
          )).then(
            () => {
              this.showModal();
              this.passwordRecoveryCode = undefined;
            },
            error => {
              this.message = error?.toString() + " - " + error.response?.data[0]?.message;
            }
          );
        }
      },
      showModal() {
        this.$refs['my-modal'].show();
      },
      hideModal() {
        this.$refs['my-modal'].hide();
        this.resetCadastro();
        this.showCadastro = false;
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
    voltarLoginSenha() {
      this.showEsqueci = !this.showEsqueci;
      this.message = "";
    }
  },
  computed: {
    senhasNaoBatem() {
      return this.senha != this.confirmacaoSenha;
    },
    senhaMenor() {
      return this.senha.length < 4;
    },
    listaMsg() {
      return this.msgSenha();
    }
  }
}
</script>

<style scoped>
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