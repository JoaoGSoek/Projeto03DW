import React, { useCallback, useEffect, useState } from 'react'
import eventoDataService from '../services/eventoDataService';

const Calendar = () => {

	// Calendar Stuff
	const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']; // Lista de dias da semana
	const monthDays = []; // Lista de dias do mês

	const [date, setDate] = useState(new Date()); // Controle do mês selecionado
	const [selectedDate, setSelectedDate] = useState(date); // Controle do dia selecionado

	const getDay = (day) => new Date(date.getFullYear(), date.getMonth(), day); // Função que retorna a data do dia selecionado
		
	const [everyEventInMonth, setEveryEventInMonth] = useState([]); // Lista de dias que contém um evento
	const resetMonthlyEvents = useCallback(() => eventoDataService.getAllInMonth(date.getFullYear(), date.getMonth() + 1).then(response => {
				
		const newEveryEventInMonth = [];
		for(let event of response.data) if(!newEveryEventInMonth.includes(parseInt(event.data.substring(8)))) newEveryEventInMonth.push(parseInt(event.data.substring(8)));
		setEveryEventInMonth(newEveryEventInMonth);

	}).catch((response) => {

		console.error(response);
		alert('Erro ao buscar eventos do mês.');

	}), [date]);

	useEffect(() => {

		resetMonthlyEvents();

	}, [resetMonthlyEvents]);

	const numDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Quantidade de dias no mês selecionado
	const startingWeekDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 1; // Em que dia da semana começa o mês
	for(let i = 1; i <= numDays; i++){ // Gerando botões do calendário

		const buttonDate = getDay(i);
		monthDays.push(
			<button
				key={`day-${i}`}
				onClick={() => setSelectedDate(buttonDate)}
				style={i === 1 ? {gridColumn: startingWeekDay} : {}}
				className={`
					${buttonDate.setHours(0, 0, 0, 0) === (new Date()).setHours(0, 0, 0, 0) ? 'today' : ''}
					${buttonDate.setHours(0, 0, 0, 0) === selectedDate.setHours(0, 0, 0, 0) ? 'selected' : ''}
					${everyEventInMonth.includes(buttonDate.getDate()) ? 'hasEvent' : ''}
				`}
			>
					{i}
			</button>			
		);

	}

	const prevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1)); // Próximo mês
	const nextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1)); // Mês anterior

	// Event Stuff
	const [showForm, setShowForm] = useState(false); // Flag que controla a visibilidade do formulário de evento
	const [toEdit, setToEdit] = useState(null); // Flag que controla o evento que está sendo editado
	const [newEventTitle, setNewEventTitle] = useState(''); // Título do evento que está sendo editado ou adicionado
	const [newEventDescription, setNewEventDescription] = useState(''); // Descrição do evento que está sendo editado ou adicionado
	const [events, setEvents] = useState([]); // Listagem de eventos na lateral do calendário

	// Atualizar a listagem de eventos do dia
	const resetDailyEvents = useCallback(() => eventoDataService.getAllAt(selectedDate).then(response => {
				
		setEvents(response.data);
	
	}).catch(() => {

		alert('Erro ao buscar eventos do dia.');

	}), [selectedDate]);

	useEffect(() => {

		resetDailyEvents();

	}, [selectedDate, showForm, resetDailyEvents])

	// Esconder o formulário e resetar variáveis
	const hideForm = e => {
		e.preventDefault();
		setNewEventTitle("");
		setNewEventDescription("");
		setShowForm(false);
		setToEdit(null);
	}

	// Deleção de um evento
	const deleteEvent = (e, id) => {

		e.preventDefault();
		if(window.confirm("Deseja mesmo deletar esse evento?")){

			eventoDataService.delete(id).then(() => {
				
				alert("Evento deletado com sucesso.");
				resetDailyEvents();
				resetMonthlyEvents();

			}).catch(() => {

				alert("Algo deu errado ao deletar o evento.");

			});
		
		}

	}

	// Resposta de sucesso p/ atualizar ou criar um evento
	const eventPostSuccessfulResponse = () => {

		alert(`Evento ${toEdit ? 'atualizado' : 'criado'} com sucesso!`);
		setNewEventTitle("");
		setNewEventDescription("");
		setShowForm(false);
		setToEdit(null);
		resetMonthlyEvents();

	}

	// Resposta de falha p/ atualizar ou criar um evento
	const eventPostFailedResponse = () => {

		alert(`Algo deu errado ao ${toEdit ? 'atualizar' : 'criar'} o evento.`);

	}

	// Função de criação de evento
	const createEvent = () => {

		eventoDataService.create({
			titulo: newEventTitle,
			descricao: newEventDescription,
			data: selectedDate
		})
		.then(eventPostSuccessfulResponse)
		.catch(eventPostFailedResponse);

	}

	// Função de atualização de evento
	const updateEvent = () => {

		eventoDataService.update(toEdit, {
			titulo: newEventTitle,
			descricao: newEventDescription,
			data: selectedDate
		})
		.then(eventPostSuccessfulResponse)
		.catch(eventPostFailedResponse);

	}

	// Função de envio do formulário de atualização ou criação de um evento
	const postEvent = (e) => {

		e.preventDefault();
		toEdit ? updateEvent() : createEvent();

	}

	// Função que prepara o formulário para edição de um evento
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