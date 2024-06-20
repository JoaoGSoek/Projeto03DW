import http from "../http-common";

// Chamadas HTTP pra API
class EventoDataService {

	getAllAt = date => http.get(`/eventos/at/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
	getAllInMonth = (year, month) => http.get(`/eventos/in/${year}/${month}`);
	delete = id => http.delete(`/eventos/${id}`);
	create = data => http.post("/eventos", data);
	update = (id, data) => http.put(`/eventos/${id}`, data);
	
}

export default EventoDataService = new EventoDataService();