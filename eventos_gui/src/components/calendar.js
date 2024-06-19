import React, { useEffect, useState } from 'react'
import eventoDataService from '../services/eventoDataService';

const Calendar = () => {

    // Calendar Stuff
    const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const monthDays = [];

    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(date);

    const getDay = (day) => new Date(date.getFullYear(), date.getMonth(), day);

    const numDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const startingWeekDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 1;

    for(let i = 1; i <= numDays; i++) monthDays.push(<button onClick={() => setSelectedDate(getDay(i))} key={`day-${i}`} style={i === 1 ? {gridColumn: startingWeekDay} : {}} className={`${getDay(i).setHours(0, 0, 0, 0) === (new Date()).setHours(0, 0, 0, 0) ? 'today' : ''} ${getDay(i).setHours(0, 0, 0, 0) === selectedDate.setHours(0, 0, 0, 0) ? 'selected' : ''}`}>{i}</button>);

    const prevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1));
    const nextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1));

    // Event Stuff
    const [showForm, setShowForm] = useState(false);
    const [toEdit, setToEdit] = useState(null);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [events, setEvents] = useState([]);

    const getEventAtSelectedDate = () => eventoDataService.getAllAt(selectedDate).then(response => {
            
        setEvents(response.data);
    
    }).catch(() => {

        alert('Erro ao buscar eventos.');

    });

    useEffect(() => {

        getEventAtSelectedDate();

    }, [selectedDate, showForm])

    const hideForm = e => {
        e.preventDefault();
        setShowForm(false);
    }

    const deleteEvent = (e, id) => {

        e.preventDefault();
        if(window.confirm("Deseja mesmo deletar esse evento?")){

            eventoDataService.delete(id).then(() => {
                
                alert("Evento deletado com sucesso.");
                getEventAtSelectedDate();
            
            }).catch(() => {

                alert("Algo deu errado ao deletar o evento.");

            });
        
        }

    }

    const eventPostSuccessfulResponse = () => {

        alert(`Evento ${toEdit ? 'atualizado' : 'criado'} com sucesso!`);
        setNewEventTitle("");
        setNewEventDescription("");
        setShowForm(false);
        setToEdit(null);

    }

    const eventPostFailedResponse = () => {

        alert(`Algo deu errado ao ${toEdit ? 'atualizar' : 'criar'} o evento.`);

    }

    const createEvent = () => {

        eventoDataService.create({
            titulo: newEventTitle,
            descricao: newEventDescription,
            data: selectedDate
        })
        .then(eventPostSuccessfulResponse)
        .catch(eventPostFailedResponse);

    }

    const updateEvent = () => {

        eventoDataService.update(toEdit, {
            titulo: newEventTitle,
            descricao: newEventDescription,
            data: selectedDate
        })
        .then(eventPostSuccessfulResponse)
        .catch(eventPostFailedResponse);

    }

    const postEvent = (e) => {

        e.preventDefault();
        toEdit ? updateEvent() : createEvent();

    }

    const prepareFormForUpdate = (data) => {

        setNewEventDescription(data.descricao);
        setNewEventTitle(data.titulo);
        setToEdit(data.id);
        setShowForm(true);

    }

    return (

        <main id="calendar" className="grid">
        
            <header id="calendarHeader" className="row">

                <button onClick={prevMonth} className="material-symbols-outlined">chevron_left</button>
                <div className="column">

                    <h2>{date.getFullYear()}</h2>
                    <h1>{date.toLocaleString('pt-br', {month: 'long'})}</h1>

                </div>
                <button onClick={nextMonth} className="material-symbols-outlined">chevron_right</button>

            </header>
            <section className="grid" id="days">

                {weekDays.map(val => <p key={val}>{val}</p>)}
                {monthDays.map(val => val)}

            </section>
            <section className="column" id="eventList">

                <ul className="column">

                    {events ? events.map(val => (
                        <article key={`event-${val.id}`} className="column">

                            <header className="row">

                                <h5>{val.titulo}</h5>
                                <button onClick={() => prepareFormForUpdate(val)} className="material-symbols-outlined success">edit</button>
                                <button onClick={e => deleteEvent(e, val.id)} className="material-symbols-outlined danger">delete</button>

                            </header>
                            <p>{val.descricao}</p>

                        </article>
                    )) : (
                        <p>Nenhum evento cadastrado</p>
                    )}

                </ul>
                <button onClick={() => setShowForm(true)} className="btn success">Criar Evento</button>

            </section>
            <section id="overlay" className='column' hidden={!showForm}>

                <form onSubmit={e => postEvent(e)} className="column">

                    <input type="text" placeholder="Título do evento" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)}/>
                    <textarea placeholder="Descrição do evento" value={newEventDescription} onChange={e => setNewEventDescription(e.target.value)}></textarea>
                    <div className="actions row">

                        <button className="btn danger" onClick={e => hideForm(e)}>Cancelar</button>
                        <button className="btn success">Cadastrar</button>

                    </div>

                </form>

            </section>

        </main>

    )

}

export default Calendar