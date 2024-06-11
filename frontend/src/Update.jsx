import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';



function Update() {

    const navigate = useNavigate()

    const {id} = useParams();
    const [usuario, setUsuario] = useState(null);

    const [values, setValues] = useState({
        name: '',
        email: '',
        fone: '',
        date:'',
        cpf: ''

    })

    useEffect(() => {
        axios.get(`http://localhost:3000/read/${id}`)
            .then(res => {
                console.log(res);
                setUsuario(res.data.rows[0]);
            })
            .catch(err => console.log(err));
    }, [id]);

    useEffect(() => {
        if (usuario) {
            setValues({
                name: usuario.nome,
                email: usuario.email,
                fone: usuario.fone,
                date: usuario.data_nascimento.split('T')[0], // formato de data ajustado para o input date
                cpf: usuario.cpf
            });
        }
    }, [usuario]);

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/update/${id}`, values)
            .then(res => {
                console.log('Usuário atualizado:', res.data);
                navigate('/');
            })
            .catch(err => console.log(err));
    };

    if (!usuario) {
        return <div>Loading...</div>;
    }

    return (
        <div className='d-flex vh-100 bg-success justify-content-center align-items-center'>
            <div className="w-50 bg-white rounded p-3">
                <h2>Atualizar Usuário</h2>
                <form onSubmit={handleUpdate}>
            <div className="mb-2">
                <label htmlFor="" className="form-label">Nome</label>
                <input type="text" className="form-control" id="name" name="name" value={values.name}
                onChange= {e => setValues({...values, name: e.target.value})}/>
            </div>

            <div className="mb-2">
                <label htmlFor="" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" value={values.email}
                onChange= {e => {setValues({...values, email: e.target.value});
                console.log("Estado atualizado:", values)}}/>
                
            </div>
            <div className="mb-2">
                <label htmlFor="" className="form-label">Telefone</label>
                <input type="text" className="form-control" id="fone" name="fone" value={values.fone}
                onChange= {e => setValues({...values, fone: e.target.value})}/>
            </div>
            <div className="mb-2">
                <label htmlFor="" className="form-label">Data de Nascimento</label>
                <input type="date" className="form-control" id="date" name="date" value={values.date}
                onChange= {e => setValues({...values, date: e.target.value})}/>
            </div>
            <div className="mb-2">
                <label htmlFor="" className="form-label">CPF</label>
                <input type="text" className="form-control" id="cpf" name="cpf" placeholder="xxx.xxx.xxx-xx" value={values.cpf}
                onChange= {e => setValues({...values, cpf: e.target.value})}/>
            </div>
                <button className="btn btn-success" type="submit">ATUALIZAR</button>
            </form>
            </div>
        </div>
    );
}

export default Update;
