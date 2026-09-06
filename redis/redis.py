# implementing res
import redis
import time

# Create Redis client
client = redis.Redis(
    host='localhost',
    port=6379,
    decode_responses=True  # Return strings instead of bytes
)

def perform_operations():
    try:
        # Basic string operations
        client.set('user:1:name', 'John Doe')
        print("Set user:1:name to John Doe")
        
        # Get value
        name = client.get('user:1:name')
        print(f"Retrieved name: {name}")
        
        # Set with expiration (5 seconds)
        client.setex('temp:key', 5, 'This will expire in 5 seconds')
        print("Set temporary key with 5s expiration")
        
        # Working with hashes
        client.hset('user:1', mapping={
            'email': 'john@example.com',
            'age': '30'
        })
        print("Set user hash fields")
        
        user = client.hgetall('user:1')
        print(f"Retrieved user: {user}")
        
        # Working with lists
        client.lpush('tasks', 'Task 1')
        client.lpush('tasks', 'Task 2')
        tasks = client.lrange('tasks', 0, -1)
        print(f"Tasks list: {tasks}")
        
        # Working with sets
        client.sadd('tags', 'python')
        client.sadd('tags', 'redis')
        client.sadd('tags', 'programming')
        tags = client.smembers('tags')
        print(f"Tags set: {tags}")
        
        # Check if key exists
        exists = client.exists('user:1:name')
        print(f"Key exists: {exists}")
        
        # Delete a key
        client.delete('temp:key')
        print("Deleted temp:key")
        
        # Increment a counter
        client.incr('counter')
        client.incr('counter')
        counter = client.get('counter')
        print(f"Counter value: {counter}")
        
    except redis.RedisError as e:
        print(f"Redis error: {e}")
    finally:
        client.close()
        print("Redis connection closed")

if __name__ == "__main__":
    perform_operations()
