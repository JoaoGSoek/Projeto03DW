package dw.eventos.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import dw.eventos.model.Evento;

public interface EventoRepository extends JpaRepository<Evento, Long>{
    
    List<Evento> findByData(Date data);    
    List<Evento> findByTituloContaining(String titulo);

	@Query("select e from Evento e where year(e.data) = :year and month(e.data) = :month")
    List<Evento> findByYearAndMonth(int year, int month);
    
}
