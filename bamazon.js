let mysql = require('mysql');
let inquire = require('inquirer');
let chosen,quantity,cost;
let connection = mysql.createConnection({
    host:"localhost",
    password:'password',
    user:'root',
    database:'bamazon_db'
});

connection.connect(function(err){

    if(err){throw err};
    console.log("connected!");
    connection.query("DROP TABLE products;",function(err,result){
        if(err){throw err};
    })
    connection.query(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER(10) AUTO_INCREMENT PRIMARY KEY NOT NULL,
        product_name TEXT NOT NULL,
        department_name TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INTEGER NOT NULL);`
        ,function(err,result){
        if(err){throw err}
    })
    let arr=[
        ["iphone","technology",1000,10],
        ["ipad","technology",500,10],
        ["water","food",1,1000],
        ["paper","office",1.99,100],
        ["keyboard","technology",30,30],
        ["mouse","technology",10,50],
        ["toothpaste","hygiene",3,100],
        ["laptop","technology",2000,10],
        ["pen","office",1,100],
        ["stapler","office",10,20],
    ];
    connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?`,[arr],function(err,result){
        if(err){throw err};
        console.log("all 10 products inserted")
    });

    connection.query('DELETE from products WHERE id>10;',function(err,result){
        if(err){throw err};
        console.log("limited to 10 rows")
    });

    connection.query('SELECT * FROM products',function(err,result,fields){
        if(err){throw err};
        console.log(result);
    });
    
});
purchase();


function purchase(){
    inquire.prompt([
        {
            type:'list',
            choices:['1','2','3','4','5','6','7','8','9','10'],
            message:'Which ID would you like to buy?',
            name:'id'
        },
        {
            type:'input',
            message:'How many would you like to purchase?',
            name:'quantity'
        }
    ]).then(function(data){
        chosen = parseInt(data.id);
        quantity = parseInt(data.quantity);
        connection.query('SELECT * FROM products WHERE id='+chosen+";",function(err,result){
            if(err){throw err};
            cost = parseInt(result[0].price);
            if(result[0].stock_quantity<quantity){
                console.log('Insufficient Quantity!')
            }else{
                connection.query('UPDATE products SET stock_quantity = '+(parseInt(result[0].stock_quantity)-quantity)+";",function(err,result){
                    if(err){console.log(err)}
                    
                })
            };
            console.log("Total Cost: $"+quantity*cost);
            
        })
    });
}