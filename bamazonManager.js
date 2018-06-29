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
            connection.query('SELECT * FROM products;',function(err,result){
                console.log(result);
            })
            break;
        case options[1] :
            //list items with count lower than 5
            connection.query('SELECT * FROM products WHERE stock_quantity < 5;',function(err,result){
                if(err){throw err};
                console.log(result);
            })
            break;
        case options[2] :
            //add more quantity to products table
            inquire.prompt([
                {
                    type:'input',
                    name:'id',
                    message:'Please enter the id of the item: '
                }
            ]).then(function(data){
                let quantity;
                connection.query('SELECT * FROM products WHERE id = '+parseInt(data.id)+";",function(err,result){
                    if(err){throw err};
                    quantity = parseInt(result[0].stock_quantity);

                    connection.query('UPDATE products SET stock_quantity = '+(quantity+5)+" WHERE id = "+data.id+";",function(err,result){
                        if(err){throw err};
                        console.log('Update Successful!');
                        
                    })
                });
            })
            break;
        case options[3] :
            //add new items to products
            inquire.prompt([
                {
                    type:'input',
                    message:"Add new items to table by typing in product_name,department_name,price,stock_quantity all separated by commas: ",
                    name:'newProduct' 
                }
            ]).then(function(data){
                let product = (data.newProduct).split(',');
                product[2]=parseInt(product[2]);
                product[3]=parseInt(product[3]);
                console.log(product);
                connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?;',[[product]],function(err,result){
                    if(err){throw err};
                    printAll();
                });
            });

            break;
        default:
            break;
    }
});

function printAll(){
    connection.query('SELECT * FROM products;',function(err,result){
        console.log(result);
    });
}