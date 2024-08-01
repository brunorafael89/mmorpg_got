/* importar o módulo do crypto */
var crypto = require("crypto");

function UsuariosDAO(connection){
    //Quando essa funcao é executada ela retorna o db que é a variável que contém o obj de conexão
    //this._connection: essa variável só deverá ser utilizada dentro da própria função
    this._connection = connection();
}

//pegando o obj e inserindo no BD com o prototype
//a propriedade (inserirUsuario) irá receber uma função
UsuariosDAO.prototype.inserirUsuario = function(usuario){
    //open: obj db forneceu uma função, esta função recebe por parametro uma função de  callback
    //funnção callback recebe como 1º parametro o error e 2º parametro obj de conexão com o BD   
    this._connection.open( function(err, mongoclient){
         /*collection: permite manipular os obj dentro das collection e ela espera como 1º parametro collection 
         e 2º paramentro uma função de callback*/
        //função de callback: 1º parametro error e 2º parametro obj que vai permitir realizar a manipulação da collection
        mongoclient.collection("usuarios", function(err, collection){
            
			//Chamada da função CreateHash que espera por parâmetro uma string informando o método de criptografia.
			//update onde informamos a string que será criptografada
			/*digest digerir as duas informações anteriores, espera por parâmetro uma forma autoput(cuspir a informação)
			neste caso um hex de hexadecimal*/
			//com esta linha de comando recuperamos uma senha criptografada
			var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");

			usuario.senha = senha_criptografada;

			//inserindo os dados do usuário
            collection.insert(usuario);

            mongoclient.close();
        });
    });
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){

			var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
			usuario.senha = senha_criptografada;

			collection.find(usuario).toArray(function(err, result){ 

				if(result[0] != undefined){

					req.session.autorizado = true;

					req.session.usuario = result[0].usuario;
					req.session.casa = result[0].casa;
				}

				if(req.session.autorizado){
					res.redirect("jogo");
				} else {
					res.render("index", {validacao: {}});
				}

			});
			mongoclient.close();
		});
	});
}

module.exports = function(){
    return UsuariosDAO;
}