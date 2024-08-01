module.exports.cadastro = function(application, req, res){
    //Renderizando para a view
    res.render('cadastro', {validacao: {}, dadosForm: {}});
}

module.exports.cadastrar = function(application, req, res){

    var dadosForm = req.body;

    req.assert('nome', 'Nome não pode ser vazio').notEmpty();
    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazio').notEmpty();
    req.assert('casa', 'Casa não pode ser vazio').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('cadastro', {validacao: erros, dadosForm: dadosForm});
        return;
    }

    //importando o modulo de conexao com o BD(dbConnection)
    var connection = application.config.dbConnection;

    //UsuariosDAO contém a instancia do obj
    var UsuariosDAO = new application.app.models.UsuariosDAO(connection);

    var JogoDAO = new application.app.models.JogoDAO(connection);

    //Executando a função inserirUsuario que está recebendo os parametros do formulario
    UsuariosDAO.inserirUsuario(dadosForm);
    JogoDAO.gerarParametros(dadosForm.usuario);


    res.send('podemos cadastrar')
}