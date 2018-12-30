let intervalo1
let intervalo2

new Vue({
    el: '#app',
    data: {
        posicaoDeAtaque: false,
        posicaoDeAtaqueMonstro: false,
        percentualDeVidaFada: 100,
        percentualDeVidaMonstro: 100,
        resultado: '',
        inicioDoJogo: true,
        logs: []
    },
    methods: {
        iniciarJogo(){
            this.posicaoDeAtaque = false
            this.posicaoDeAtaqueMonstro = false
            this.percentualDeVidaFada = 100
            this.percentualDeVidaMonstro = 100
            this.resultado = ''
            this.inicioDoJogo = !this.inicioDoJogo
            this.logs = []
            clearInterval(intervalo1)
            clearInterval(intervalo2)
            this.randomizeAtaqueMonstro()
            intervalo1 = setInterval(() => {
                this.randomizeAtaqueMonstro()
            }, 5000);
        },
        randomizeAtaqueMonstro(){
            clearInterval(intervalo2)
            intervalo2 = setInterval(() => {
                this.colocarEmPosicaoDeAtaqueMonstro()
                const {_danoFada, _percentualDeVidaFada} = this.monstroAtaca(6)
                this.checarSeAlguemGanhou(this.percentualDeVidaMonstro, _percentualDeVidaFada)
                this.escreverLog(0, _danoFada)
            }, Math.floor(Math.random() * (3000 - 350)) + 350);
        },
        sairDoJogo(){
            this.iniciarJogo()
        },
        atacar(){
            this.colocarEmPosicaoDeAtaque()
            const {_danoMonstro, _percentualDeVidaMonstro } = this.fadaAtaca(5)
            const {_danoFada, _percentualDeVidaFada} = this.monstroAtaca(6)
            this.checarSeAlguemGanhou(_percentualDeVidaMonstro, _percentualDeVidaFada)
            this.escreverLog(_danoMonstro, _danoFada)
        },
        atacarEspecial(){
            this.colocarEmPosicaoDeAtaque()
            const {_danoMonstro, _percentualDeVidaMonstro} = this.fadaAtaca(10)
            const {_danoFada, _percentualDeVidaFada} = this.monstroAtaca(8)
            this.checarSeAlguemGanhou(_percentualDeVidaMonstro, _percentualDeVidaFada)
            this.escreverLog(_danoMonstro, _danoFada)
        },
        curar() {
            if (this.percentualDeVidaFada < 100) {
                const {_curaFada} = this.fadaSeCura(6)
                const {_danoFada} = this.monstroAtaca(4)
                _percentualDeVidaFada = (_curaFada - _danoFada) + this.percentualDeVidaFada
                this.checarSeAlguemGanhou(this.percentualDeVidaMonstro, _percentualDeVidaFada)
                this.escreverLogCura(_danoFada, _curaFada)
            }
        },
        colocarEmPosicaoDeAtaque(){
            this.posicaoDeAtaque = true;
            setTimeout(() => {
                this.posicaoDeAtaque = false
            }, 400);
        },
        colocarEmPosicaoDeAtaqueMonstro(){
            this.posicaoDeAtaqueMonstro = true;
            setTimeout(() => {
                this.posicaoDeAtaqueMonstro = false
            }, 400);
        },
        fadaAtaca(quantidade){
            const _dano = Math.floor(Math.random() * 10 + quantidade)
            const _percentualDeVida = this.percentualDeVidaMonstro - _dano
            return {
                _danoMonstro: _dano,
                _percentualDeVidaMonstro: _percentualDeVida
            }
        },
        monstroAtaca(quantidade){
            const _dano = Math.floor(Math.random() * 10 + quantidade)
            const _percentualDeVida = this.percentualDeVidaFada - _dano
            return {
                _danoFada: _dano,
                _percentualDeVidaFada: _percentualDeVida
            }
        },
        fadaSeCura(quantidade){
            const _cura = Math.floor(Math.random() * 10 + quantidade)
            const _percentualDeVida = this.percentualDeVidaFada + _cura
            return {
                _curaFada: _cura,
                _percentualDeVidaFada: _percentualDeVida
            }
        },
        fadaGanhou(monstro, fada){
            if (monstro <= 0 && fada > monstro) {
                return true
            } else {
                return false
            }
        },
        checarSeAlguemGanhou(monstro, fada){
            
            if (monstro <= 0 && fada > monstro) {
                // fada ganhou
                this.percentualDeVidaMonstro = 0
                this.resultado = 'Uhuuuuu!!! Você ganhou!'
                this.inicioDoJogo = true
                clearInterval(intervalo1)
                clearInterval(intervalo2)
            }
            
            if (fada <=0 && monstro > fada) {
                // monstro ganhou
                this.percentualDeVidaFada = 0
                this.resultado = 'Você perdeu !'
                this.inicioDoJogo = true
                clearInterval(intervalo1)
                clearInterval(intervalo2)
            }

            if (fada == monstro && fada <= 0 && monstro <= 0) {
                // empate
                this.percentualDeVidaFada = 0
                this.percentualDeVidaMonstro = 0
                this.resultado = 'Empate!'
                this.inicioDoJogo = true
                clearInterval(intervalo1)
                clearInterval(intervalo2)
            }

            if (fada > 0 && monstro > 0) {
                // ninguem, ganhou ainda
                this.percentualDeVidaFada = fada
                this.percentualDeVidaMonstro = monstro
            }
        },
        escreverLog(danoMonstro, danoFada){
            this.logs.unshift('O monstro atingiu você com ' + danoFada)
            this.logs.unshift('Você atingiu o monstro com ' + danoMonstro)
        },
        escreverLogCura(danoFada, curaFada) {
            this.logs.unshift('O monstro atingiu você com ' + danoFada)
            this.logs.unshift('Você ganhou força de ' + curaFada)
        }
    },
    computed: {
        indicadorDeVidaFada() {
            let _largura = this.percentualDeVidaFada + '%'
            let _cor = '#00ff33'

            if (this.percentualDeVidaFada < 0) {
                _largura = '0'
                _cor = 'red'
            } else if (this.percentualDeVidaFada > 0 && this.percentualDeVidaFada <= 20) {
                _cor = 'red'
            } else if (this.percentualDeVidaFada > 20 && this.percentualDeVidaFada <= 100) {
                _cor = '#00ff33'
            } else if (this.percentualDeVidaFada > 100) {
                _largura = '100%'
                _cor = '#00ff33'
            }
            
            return {
                backgroundColor: _cor,
                width: _largura
            }
        },
        indicadorDeVidaMonstro() {
            let _largura = this.percentualDeVidaMonstro + '%'
            let _cor = '#00ff33'

            if (this.percentualDeVidaMonstro < 0) {
                _largura = '0'
                _cor = 'red'
            } else if (this.percentualDeVidaMonstro > 0 && this.percentualDeVidaMonstro <= 20) {
                _cor = 'red'
            } else if (this.percentualDeVidaMonstro > 20 && this.percentualDeVidaMonstro <= 100) {
                _cor = '#00ff33'
            } else if (this.percentualDeVidaMonstro > 100) {
                _largura = '100%'
                _cor = '#00ff33'
            }
            
            return {
                backgroundColor: _cor,
                width: _largura
            }
        }
    }
})