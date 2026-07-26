const pg = require('pg');
const pool = new pg.Pool({connectionString: 'postgresql://podsypro_v03serkan:h*RHi-365cVkWK(6@localhost:5432/podsypro_v03'});
pool.query('SELECT current_schema(), current_user, table_name FROM information_schema.tables WHERE table_schema = current_schema() LIMIT 5')
  .then(r => { console.log(JSON.stringify(r.rows, null, 2)); pool.end(); })
  .catch(e => { console.error('ERROR:', e.message); pool.end(); });
