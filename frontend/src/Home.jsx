import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import logoBase64 from './logoBase64'; // Certifique-se de que este arquivo está corretamente importado

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Home() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get('http://localhost:3000/')
            .then(res => {
                if (res.data && Array.isArray(res.data.rows)) {
                    setData(res.data.rows);
                } else {
                    console.error('Expected an array in res.data.rows, but got', res.data);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/delete/${id}`)
            .then(res => {
                // Atualizar o estado local após a exclusão sem recarregar a página
                setData(prevData => prevData.filter(usuario => usuario.id !== id));
            })
            .catch(err => console.log(err));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const filteredData = data.filter(usuario =>
        usuario.cpf.includes(searchTerm)
    );

    const generatePDF = (usuario) => {
        const documentDefinition = {
            content: [
                {
                    columns: [
                        {
                            image: logoBase64,
                            width: 70,
                        },
                        {
                            text: 'Ministério Público do Estado do Pará',
                            style: 'header',
                            alignment: 'center',
                            margin: [0, 15, 0, 0],
                        }
                    ]
                },
                { text: 'Informações do Usuário', style: 'subheader' },
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            ['ID', usuario.id],
                            ['Nome', usuario.nome],
                            ['Email', usuario.email],
                            ['Fone', usuario.fone],
                            ['Data de Nascimento', formatDate(usuario.data_nascimento)],
                            ['CPF', usuario.cpf],
                        ]
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    marginBottom: 20
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    marginTop: 20,
                    marginBottom: 10
                },
                table: {
                    margin: [0, 5, 0, 15]
                }
            }
        };

        pdfMake.createPdf(documentDefinition).download(`usuario_${usuario.id}.pdf`);
    };

    return (
        <div className="d-flex vh-100 bg-success justify-content-center align-items-center">
            <div className="w-55 bg-white rounded p-3">
                <h2 className="text-center">Cadastro</h2>
                <div className="d-flex justify-content-end mt-3 mb-3">
                    <input
                        type="text"
                        placeholder="Pesquisar por CPF..."
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Link to="/create" className="btn btn-success mt-3 mb-2">Adicionar</Link>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Fone</th>
                            <th>Data de Nascimento</th>
                            <th>CPF</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filteredData) && filteredData.length > 0 ? (
                            filteredData.map((usuario, index) => (
                                <tr key={index}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.fone}</td>
                                    <td>{formatDate(usuario.data_nascimento)}</td>
                                    <td>{usuario.cpf}</td>
                                    <td>
                                        <Link to={`/read/${usuario.id}`} className="btn btn-sm btn-info">Ver</Link>
                                        <Link to={`/edit/${usuario.id}`} className="btn btn-sm btn-warning">Editar</Link>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(usuario.id)}>Deletar</button>
                                        <button className="btn btn-sm btn-dark" onClick={() => generatePDF(usuario)}>PDF</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Nenhum dado disponível</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Home;
