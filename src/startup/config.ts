import config from 'config';

export default function () {
  if (!config.get('dbPassword')) {
    throw new Error('FATAL ERROR: notes_mysql_dbPassword enviroment varaible is not defined.');
  }
}
