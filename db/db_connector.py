import mysql.connector

class DBConnector:
    def __init__(self):
        self.connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password= 'password',
            database='usdt2inr',
            auth_plugin='mysql_native_password'
        )
        self.cursor = self.connection.cursor()

    def execute_query(self, query, values=None):
        try:
            self.cursor.execute(query, values)
            self.connection.commit()  # Commit the changes to the database
            return True
        except Exception as e:
            print(f"Error executing query: {e}")
            self.connection.rollback()
            return False
    def execute_query_raise(self, query, values=None):
        try:
            self.cursor.execute(query, values)
            self.connection.commit()  # Commit the changes to the database
            return True
        except Exception as e:
            print(f"Error executing query: {e}")
            self.connection.rollback()
            raise e

    def execute_queries(self, query1, query2,  values1=None, values2=None):
        try:
            self.cursor.execute("START TRANSACTION;")
            self.cursor.execute(query1, values1)
            if self.cursor.rowcount == 0:
                self.connection.rollback()
                return False

            self.cursor.execute(query2, values2)
            if self.cursor.rowcount == 0:
                self.connection.rollback()
                return False
            else:
                self.connection.commit()  # Commit the changes to the database
                return True
        except Exception as e:
            print(f"Error executing query: {e}")
            self.connection.rollback()
            return False


    def fetch_all(self, query, values=None):
        self.cursor.execute(query, values)
        result = self.cursor.fetchall()
        return result

    def get_stored_password(self, phone):
        try:
            query = "SELECT wdtpasswd FROM users WHERE phonenumber = %s"
            values = (phone,)

            result = self.fetch_all(query, values)
            stored_password = result[0][0] if result else None
            return stored_password

        except Exception as e:
            print(f"Error getting stored password: {e}")
            return None

    def close_connection(self):
        self.cursor.close()
        self.connection.close()
