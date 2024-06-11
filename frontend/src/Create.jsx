import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Create() {

    const [values, setValues] = useState({
        name: '',
        email: '',
        fone: '',
        date:'',
        cpf: ''

    })

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/user', values)
        .then(res => {
            console.log(res);
            navigate('/')
        })
        .catch(err => console.log(err))

         // Verificar se o estado foi atualizado
        console.log("Estado atualizado:", values);
    }
    return (
        <div className='d-flex vh-100 bg-success justify-content-center align-items-center'>
            <div className="w-50 bg-white rounded p-3">
                <h2>Adiconar Usuário</h2>
                <form onSubmit={handleSubmit}>
            <div className="mb-2">
                <label htmlFor="" className="form-label">Nome</label>
                <input type="text" className="form-control" id="name" name="name"
                onChange= {e => setValues({...values, name: e.target.value})}/>
            </div>

            <div className="mb-2">
                <label htmlFor="" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email"
                onChange= {e => {setValues({...values, email: e.target.value});
                console.log("Estado atualizado:", values)}}/>
                
            </div>
            <div className="mb-2">
                <label htmlFor="" className="form-label">Telefone</label>
                <input type="text" className="form-control" id="fone" name="fone"
                onChange= {e => setValues({...values, fone: e.target.value})}/>
            </div>
            <div className="mb-2">
                <label htmlFor="" className="form-label">Data de Nascimento</label>
                <input type="date" className="form-control" id="date" name="date"
                onChange= {e => setValues({...values, date: e.target.value})}/>
            </div>
            <div className="mb-2">
                <label htmlFor="" className="form-label">CPF</label>
                <input type="text" className="form-control" id="cpf" name="cpf" placeholder="xxx.xxx.xxx-xx"
                onChange= {e => setValues({...values, cpf: e.target.value})}/>
            </div>
                <button className="btn btn-success" type="submit">ENVIAR</button>
            </form>
            </div>
        </div>
        
        )
}

export default Create;
