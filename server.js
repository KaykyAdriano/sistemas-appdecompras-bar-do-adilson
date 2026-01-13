const express = require('express')
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())


const SENHA_ADMIN = "adilson123"

// Função auxiliar para ler produtos
function lerProdutos() {
    const data = fs.readFileSync('produtos.json')
    return JSON.parse(data)
}

//(Só mostra o que está disponível)
app.get('/cardapio', (req, res) => {
    const produtos = lerProdutos()
    // Filtra apenas os disponiveis = true
    const produtosAtivos = produtos.filter(p => p.disponivel === true)
    res.json(produtosAtivos)
});

//Painel Admin (Mostra tudo + Login)
app.post('/admin/produtos', (req, res) => {
    const { senha } = req.body
    if (senha !== SENHA_ADMIN) {
        return res.status(403).json({ erro: "Senha incorreta" })
    }
    const produtos = lerProdutos()
    res.json(produtos)
})

//Atualiza o Estoque (Ligar/Desligar produto)
app.post('/admin/atualizar', (req, res) => {
    const { senha, id, status } = req.body
    
    if (senha !== SENHA_ADMIN) {
        return res.status(403).json({ erro: "Não autorizado" })
    }

    let produtos = lerProdutos()
    // Encontra o produto e atualiza
    produtos = produtos.map(p => {
        if (p.id === id) {
            return { ...p, disponivel: status }
        }
        return p
    });

    fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2))
    res.json({ mensagem: "Atualizado com sucesso!" })
})

