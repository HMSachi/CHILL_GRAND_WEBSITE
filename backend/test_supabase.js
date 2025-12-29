const supabase = require('./src/config/db');

async function testConnection() {
    try {
        const { data, error } = await supabase.from('contact_messages').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('✅ Supabase Connection successful. Row count:', data); // data is null for head:true with count
        process.exit(0);
    } catch (err) {
        console.error('❌ Supabase Connection failed:', err);
        process.exit(1);
    }
}

testConnection();
