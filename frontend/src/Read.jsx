import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function Read() {
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/read/${id}`)
            .then(res => {
                console.log(res);
                setUsuario(res.data.rows[0]);
            })
            .catch(err => console.log(err));
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    if (!usuario) {
        return (
            <div className="d-flex vh-100 bg-success justify-content-center align-items-center">
                <div className="w-55 bg-white rounded p-3">
                    <h2 className="text-center">Carregando...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex vh-100 bg-success justify-content-center align-items-center">
            <div className="w-55 bg-white rounded p-3">
                <div className='p-2'>
                
                <h2 className="text-center">Informações do Usuário</h2>
                {usuario ? (
                    <>
                        <h2>ID: {usuario.id}</h2>
                        <h2>Nome: {usuario.nome}</h2>
                        <h2>Email: {usuario.email}</h2>
                        <h2>Fone: {usuario.fone}</h2>
                        <h2>Data de Nascimento: {formatDate(usuario.data_nascimento)}</h2>
                        <h2>CPF: {usuario.cpf}</h2>
                        <div className="d-flex mt-3">
                            <Link to="/" className="btn btn-primary">Voltar</Link>
                            <Link to={`/edit/${usuario.id}`} className="btn btn-info">Editar</Link>
                        </div>
                    </>
                ) : (
                    <h2>Carregando...</h2>
                )}
                </div>
            </div>
        </div>
    );
}

export default Read;
