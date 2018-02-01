document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('btnRequestAllAPIS').onclick = function(e) {
        e.preventDefault();
        axios.get('/api/apis').then(function(results) {
            console.log(JSON.stringify(results.data, null, 4));
            console.log(results.data);
        });
    }
});