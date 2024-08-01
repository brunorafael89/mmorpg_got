/* importar o mongodb */
var mongo = require('mongodb');

var connMongoDB = function(){
    //console.log('Entrou na função de conexão');
    var db = new mongo.Db(
        'got', 
        new mongo.Server(
            '127.0.0.1', //string contendo o endereço do servidor
            27017, //porta de conexão
            {}//objeto com opções de configuração do servidor
        ), 
        {}//objeto de configuração do servidor
    );

    return db;
}



//incorporar no autoload do consign
module.exports = function(){
    return connMongoDB;
}