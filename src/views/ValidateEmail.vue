<template>
    <div>
        <b-spinner v-if="loading" label="Carregando"></b-spinner>
        <b-modal v-else ref="my-modal" hide-footer hide-header>
            <div class="d-block text-center">
              <h3>Email confirmado com sucesso!<br>Realize login para continuar.</h3>
            </div>
            <b-button class="mt-3" variant="outline-success" block @click="hideModal">Ok</b-button>
          </b-modal>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
      return {
        loading: false
      }
    },
    watch: {
        '$route' (to) {
            let that = this;
            that.loading = true;
            axios.post(`mail/verify?code=${to.params.verifyCode}`)
                .then(() => {
                    that.showModal();
                    that.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                    that.loading = false;
                });
        }
    },
    methods: {
        showModal() {
            this.$refs['my-modal'].show();
        },
        hideModal() {
            this.$refs['my-modal'].hide();
            this.$router.push('/home');
        }
    }
}
</script>
 