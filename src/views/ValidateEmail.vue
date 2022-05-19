<template>
    <div>
        <h1>Teste</h1>
        <p>JWT é {{$route.params.jwtToken}}</p>
    </div>
</template>

<script>
export default {
    watch: {
        '$route' (to) {
            alert(to.params.jwtToken);
        }
    }

}
</script>
