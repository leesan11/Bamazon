let inquire = require('inquirer');
let mysql = require('mysql');
let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'bamazon_db'
});
connection.connect(function(err){
    if(err){throw err};
    console.log('Succesfully Connected!')
})

let options = [
    'View Products for Sale',
    'View Low Inventory',
    'Add to Inventory',
    'Add New Product'
];

inquire.prompt([
    {
        type:'list',
        choices:options,
        name:'option',
        message:'Please choose an action: '
    }
]).then(function(data){
    switch (data.option){
        case options[0] :
            //print the products
            break;
        case options[1] :
            //list items with count lower than 5
            break;
        case options[2] :
            //add more items to products table
            break;
        case options[3] :
            //add new items to products int able
            break;
        default:
            break;
    }
});

