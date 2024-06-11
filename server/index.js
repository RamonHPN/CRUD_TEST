import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import { release } from 'os';
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json())

const PORT = 3000;

app.listen(PORT, () =>{
    console.log('EU EUE EU EUEU')
})

const pool = new Pool({
    user: 'postgres',
    host: "localhost",
    database: "cadastro",
    password: "Suporte27",
    dialect: 'postgres',
    port: '5432'
});

pool.connect((err, client, realese) =>{
    if(err){
        return console.error('error in connection')
    }
    client.query('SELECT NOW()', (err, result) =>{
        release()
        if(err){
            return console.error('Error executing querry')
        }
        console.log("conectado!" + result)
    })
})

app.get('/', (req, res) =>{
    const psg = "SELECT * FROM usuario";
    pool.query(psg, (err, result)=> {
        if(err) return res.json({Message: "erro no serv"});
        console.log(result)
        return res.json(result);
        
    })
})

app.post('/user', async (req, res) => {
    const { name, email, fone, date, cpf } = req.body;
    const psg = "INSERT INTO usuario (nome, email, fone, data_nascimento, cpf) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const vlaues = [name, email, fone, date, cpf];

    // try {
    //     const result = await pool.query(psg, vlaues);
    //     console.log(result);
    // } catch (error) {
    //     console.error('Error inserting user:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    // }
    pool.query(psg, vlaues, (err, result) => {
        if(err) return res.json(err);
        return res.json(result);

    })
});

app.get('/read/:id',(req, res) => {

    const psg = `SELECT * FROM usuario WHERE id= $1`

    const id = req.params.id;
    pool.query(psg, [id], (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result)
    })
})

app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, fone, date, cpf } = req.body;
    const psg = "UPDATE usuario SET nome = $1, email = $2, fone = $3, data_nascimento = $4, cpf = $5 WHERE id = $6 RETURNING *";
    const values = [name, email, fone, date, cpf, id];

    try {
        const result = await pool.query(psg, values);
        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const psg = "DELETE FROM usuario WHERE id = $1 RETURNING *";
    
    try {
        const result = await pool.query(psg, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        return res.json({ message: 'Usuário deletado com sucesso', user: result.rows[0] });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
