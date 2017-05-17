'use strict';

var Datastore=require('nedb');

// コレクションの定義
var databases={
	'users':new Datastore({ filename: 'var/nedb/users.db' }),
};

// ロード
for(var database_name in databases) {
	databases[database_name].loadDatabase();
}

module.exports=databases;
