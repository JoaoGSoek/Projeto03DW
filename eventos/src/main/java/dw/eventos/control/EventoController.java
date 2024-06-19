package dw.eventos.control;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dw.eventos.model.Evento;
import dw.eventos.repository.EventoRepository;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/api")
public class EventoController {

    @Autowired
    EventoRepository rep;
    
    /*
     * GET /api/eventos : listar todos os Eventos
     */
    @GetMapping("/eventos")
    public  ResponseEntity<List<Evento>> getAllEventos(@RequestParam(required = false) String titulo)
    {
        try
        {
            List<Evento> la = new ArrayList<Evento>();

            if (titulo == null)
                rep.findAll().forEach(la::add);
            else
                rep.findByTituloContaining(titulo).forEach(la::add);

            if (la.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            
            return new ResponseEntity<>(la, HttpStatus.OK);
        }
         catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /*
     * POST /api/eventos : criar Evento
     */
    @PostMapping("/eventos")
    public ResponseEntity<Evento> createEvento(@RequestBody Evento ar)
    {   
        try {
            Evento _a = rep.save(new Evento(ar.getTitulo(), ar.getDescricao(), ar.getData()));

            return new ResponseEntity<>(_a, HttpStatus.CREATED);
            
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /*
     * GET /api/eventos/at/:data : listar Evento dado uma data
     */
    @GetMapping("/eventos/at/{data}")
    public ResponseEntity<List<Evento>> getEventoByDate(@PathVariable("data") Date data)
    {
        try
        {
            List<Evento> la = new ArrayList<Evento>();
            rep.findByData(data).forEach(la::add);
            if (la.isEmpty()) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            return new ResponseEntity<>(la, HttpStatus.OK);
        }
         catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
     * GET /api/eventos/:id : listar Evento dado uma data
     */
    @GetMapping("/eventos/{id}")
    public ResponseEntity<Evento> getEventoById(@PathVariable("id") long id)
    {
        Optional<Evento> data = rep.findById(id);

        if (data.isPresent())
            return new ResponseEntity<>(data.get(), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /*
     * PUT /api/eventos/:id : atualizar Evento dado um id
     */
    @PutMapping("/eventos/{id}")
    public ResponseEntity<Evento> updateEvento(@PathVariable("id") long id, @RequestBody Evento a)
    {
        Optional<Evento> data = rep.findById(id);

        if (data.isPresent())
        {
            Evento ar = data.get();
            ar.setData(a.getData());
            ar.setDescricao(a.getDescricao());
            ar.setTitulo(a.getTitulo());

            return new ResponseEntity<>(rep.save(ar), HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    /*
     * DEL /api/eventos/:id : remover Evento dado um id
     */
    @DeleteMapping("/eventos/{id}")
    public ResponseEntity<HttpStatus> deleteEvento(@PathVariable("id") long id)
    {
        try {
            rep.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    /*
     * DEL /api/eventos : remover todos os Eventos
     */
    @DeleteMapping("/eventos")
    public ResponseEntity<HttpStatus> deleteAllEvento()
    {
        try {
            rep.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }


}
