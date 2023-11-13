'use strict';

const mysql = require('mysql2/promise');

async function test() {
    // const c = await mysql.createConnection({
    //     // port: 3306,
    //     // user: 'root',
    //     // // namedPlaceholders: true,
    //     // password: 'testpassword'
    //     host: "localhost",
    //     user: "root",
    //     password: "12345678",
    //     database: "employee_tracker_db"
    // });
    console.log('connected!');
    const [rows, fields] = await c.query('SELECT * from department');
    console.log(rows);

    try {
        const [rows, fields] = await c.query('SELECT * from departmental');
    } catch (e) {
        console.log('caught exception!', e);
    }

    console.log(await c.execute('select sleep(0.5)'));
    console.log('after first sleep');
    console.log(await c.execute('select sleep(0.5)'));
    console.log('after second sleep');
    let start = +new Date();
    console.log(
        await Promise.all([
        c.execute('select sleep(2.5)'),
        c.execute('select sleep(2.5)')
        ])
    );
    console.log(
        'after 2+3 parallel sleep which is in fact not parallel because commands are queued per connection'
    );
    let end = +new Date();
    console.log(end - start);
    await c.end();

    const p = mysql.createPool({
        // port: 3306,
        // user: 'testuser',
        // namedPlaceholders: true,
        // password: 'testpassword'
        host: "localhost",
        user: "root",
        password: "12345678",
        database: "employee_tracker_db"
    });
    console.log(await p.execute('select sleep(0.5)'));
    console.log('after first pool sleep');
    start = +new Date();
    console.log(
        await Promise.all([
        p.execute('select sleep(2.5)'),
        p.execute('select sleep(2.5)')
        ])
    );
    console.log('after 2+3 parallel pool sleep');
    end = +new Date();
    console.log(end - start);
    await p.end();
}

    test()
    .then(() => {
        console.log('done');
    })
    .catch(err => {
        console.log('error!', err);
        throw err;
    });