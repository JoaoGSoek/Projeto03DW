import http from "../http-common";

class EventoDataService {

    getAll() {
        return http.get("/eventos");
    }

    getAllAt(date) {
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        return http.get(`/eventos/at/${date.getFullYear()}-${zeroPad(date.getMonth() + 1, 2)}-${zeroPad(date.getDate(), 2)}`);
    }

    get(id){
        return http.get(`/eventos/${id}`);
    }

    create(data){
        return http.post("/eventos",data);
    }

    update(id, data){
        return http.put(`/eventos/${id}`,data);
    }

    delete(id){ 
        return http.delete(`/eventos/${id}`);
    }

    deleteAll(){
        return http.delete("/eventos");
    }
  

    findByTitulo(data){
        return http.get(`/eventos/${data}`);
    }
}

export default new EventoDataService();