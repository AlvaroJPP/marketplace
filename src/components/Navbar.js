"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "@/styles/NavBar.module.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(""); // Armazenar o nome do usuário
  const [userRole, setUserRole] = useState(""); // Armazenar o role do usuário

  // Verificar o estado de login ao carregar a página
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUserName = localStorage.getItem("userName"); // Recuperar o nome do usuário
    const storedUserRole = localStorage.getItem("userRole"); // Recuperar o role do usuário

    if (accessToken && storedUserName && storedUserRole) {
      setIsLoggedIn(true);
      setUserName(storedUserName); // Atualizar o nome do usuário
      setUserRole(storedUserRole); // Atualizar o role do usuário
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName"); // Remover o nome do usuário ao fazer logout
    localStorage.removeItem("userRole"); // Remover o role do usuário ao fazer logout
    setIsLoggedIn(false);
    setUserName(""); // Limpar o nome do usuário
    setUserRole(""); // Limpar o role do usuário
    window.location.href = "/"; // Redirecionar para a página inicial após logout
  };

  return (
    <div className="navbar navbar-inverse">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="navbar-header">
              <button
                className="navbar-toggle"
                data-target="#mobile_menu"
                data-toggle="collapse"
              >
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link href="/" className="navbar-brand">
                GogoMart
              </Link>
            </div>

            <div className="navbar-collapse collapse" id="mobile_menu">
              <ul className="nav navbar-nav">
                <li className="active">
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <a className="dropdown-toggle" data-toggle="dropdown">
                    Produtos <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link href="#">Brinquedos</Link></li>
                    <li><Link href="#">Moveis</Link></li>
                    <li><Link href="#">Bijuterias</Link></li>
                    <li><Link href="#">Feramentas</Link></li>
                    <li><Link href="#">Eletronicos</Link></li>
                    <li><Link href="#">Roupas</Link></li>
                    <li><Link href="/Produto">Produto</Link></li>
                  </ul>
                </li>
                <li><Link href="#">Promoções</Link></li>
                <li><Link href="#">Nosso Contatos</Link></li>

                {/* Renderizando os botões específicos dependendo do 'role' */}
                {isLoggedIn && userRole === "seller" ? (
                  <>
                  <li><Link href="/minha-loja">Minha Loja</Link></li> 
                  <li><Link href="/cria-produto">Cria Produtos</Link></li> 
                  </>// Para sellers
                ) : null}

                {isLoggedIn && userRole === "user" ? (
                  <>
                    <li><Link href="/carrinho">Meu Carrinho</Link></li>
                    <li><Link href="/produtos-comprados">Meus Produtos Comprados</Link></li>
                  </>
                ) : null}
              </ul>

              <ul className="nav navbar-nav">
                <li>
                  <form action="" className="navbar-form">
                    <div className="form-group">
                      <div className="input-group">
                        <input
                          type="search"
                          name="search"
                          placeholder="Pesquise aqui..."
                          className="form-control"
                        />
                        <span className="input-group-addon">
                          <span className="glyphicon glyphicon-search"></span>
                        </span>
                      </div>
                    </div>
                  </form>
                </li>
              </ul>

              <ul className="nav navbar-nav navbar-right">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link href="#">
                        <span className="glyphicon glyphicon-user"></span> {userName} {/* Exibe o nome do usuário */}
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-toggle" data-toggle="dropdown" onClick={handleLogout}>
                        <span className="glyphicon glyphicon-log-out"></span> Logout
                      </a>
                    </li>
                  </>
                ) : (
                  <li>
                    <a className="dropdown-toggle" data-toggle="dropdown">
                      <span className="glyphicon glyphicon-log-in"></span> Login / Sign Up <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu">
                      <li><Link href="/login">Login</Link></li>
                      <li><Link href="/registro">Sign Up</Link></li>
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
