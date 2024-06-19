package dw.eventos.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import dw.eventos.model.Evento;

public interface EventoRepository extends JpaRepository<Evento, Long>{
    
    List<Evento> findByData(Date data);
    List<Evento> findByTituloContaining(String titulo);
    
}
