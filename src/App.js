import React from 'react';
import './index.css';
import triviadata from './trivia.txt';

var curValue = ""; // how much the current question is worth
var curQuestion = ""; // the question that the player selected
var curAnswer = ""; // the answer to the question that the player selected
var curAccepted = ""; // accepted answers to the current question
var show = "grid"; // determines whether the grid, a question, or an answer will be displayed
var gridArray = [[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]]; // status of all questions (0 = answered; 1 = unanswered)

// class for each box in the grid
class Square extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			rownum: parseInt(this.props.rownum),
			colnum: parseInt(this.props.colnum),
			value: this.props.value,
			q: this.props.q,
			a: this.props.a,
			accepted: this.props.accepted
		};
	}
	
	// when the player clicks on this square in the grid
	handleClick(value, q, a, accepted)
	{
		curValue = parseInt(value);
		curQuestion = q;
		curAnswer = a;
		curAccepted = accepted;
		show = "question";
		gridArray[this.state.rownum][this.state.colnum] = 0;
		this.setState({answered: true});
		this.forceUpdate();
	}
	
	render()
	{
		const { value, q, a, accepted, category } = this.props;
		var inlineStyle = {
			display: "inline",
		};
		
		return (
			<div style={inlineStyle}>
				{this.state.rownum === -1 ? (
					<div className="square border border-3 border-dark q-active categorySquare">
						<p>{category}</p>
					</div>
				) : (gridArray[this.state.rownum][this.state.colnum] === 1 ? (
					<button className="link-button" onClick={() => this.handleClick(value, q, a, accepted)}><div className="square border border-3 border-dark q-active">
						<p>{value}</p>
					</div></button>
				) : (
					<div className="square border border-3 border-dark q-answered">
						<p></p>
					</div>
				))}
			</div>
		);
	}
}

// class for a row of boxes in the grid
class Row extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			rownum: this.props.rownum,
			value: this.props.value,
			qas: this.props.qas,
		};
	}
	
	render()
	{
		const {rownum, value, qas} = this.state;
		return (
			<div>
			{this.state.rownum !== "-1" ? (
				<div className="inline">
					<Square rownum={rownum} colnum="0" value={value} q={qas[0]} a={qas[1]} accepted={qas[2]}/>
					<Square rownum={rownum} colnum="1" value={value} q={qas[3]} a={qas[4]} accepted={qas[5]}/>
					<Square rownum={rownum} colnum="2" value={value} q={qas[6]} a={qas[7]} accepted={qas[8]}/>
					<Square rownum={rownum} colnum="3" value={value} q={qas[9]} a={qas[10]} accepted={qas[11]}/>
					<Square rownum={rownum} colnum="4" value={value} q={qas[12]} a={qas[13]} accepted={qas[14]}/>
				</div>
			) : (
				<div className="inline categoryRow">
					<Square rownum={rownum} colnum="0" category={qas[0]}/>
					<Square rownum={rownum} colnum="1" category={qas[1]}/>
					<Square rownum={rownum} colnum="2" category={qas[2]}/>
					<Square rownum={rownum} colnum="3" category={qas[3]}/>
					<Square rownum={rownum} colnum="4" category={qas[4]}/>
				</div>
			)}
			</div>
		);
	}
}

class App extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			qas: "",
			show: "grid",
			score: 0,
			correct: false,
		}
	}
	
	// read text from questions.txt file and sort through it
	// the categories should be the first lines in the .txt file,
	// followed by the question, answer, and accepted answers for
	// each question, grouped by category
	handleText = () => {
        fetch(triviadata)
		.then((r)=>r.text())
		.then(text => {
			var lines = text.split('\r\n');
			var filtered = lines.filter(function(value, index, lines){
				return value !== "";
			});
			
			// at this point the array is sorted by value; we
			// now need to sort it by category
			var categories = filtered.slice(0,5);
			var columns = [[],[],[],[],[]];
			
			for(let i = 5; i < filtered.length; i++)
			{
				let num = Math.floor((i+1)/3) - 2;
				columns[num%5].push(filtered[i]);
			}
			
			var sortedqas = [...categories, ...columns[0], ...columns[1], ...columns[2], ...columns[3], ...columns[4]]
			
			this.setState({qas: sortedqas});
		})
    }
	
	// when the player clicks one of the boxes in the grid
	handleGridClick()
	{
		this.forceUpdate();
	}
	
	// when the answer to a question is shown, the player clicks the
	// panel to go back to the grid view
	handlePanelClick()
	{
		if(show === "answer")
		{
			show = "grid";
		}
		this.forceUpdate();
	}
	
	// when the player submits an answer to a question
	submitAnswer()
	{
		if(show === "question")
		{
			show = "answer";
		}
		
		// if the answer in the .txt file ends in an asterisk *, check
		// if the player's answer matches exactly
		// otherwise, check if any of the accepted answers are a
		// substring of the player's answer
		var ans = document.getElementById("questionInput").value.toLowerCase();
		var acceptedAnswers = curAccepted.split(",");
		this.setState({correct: false});
		for(let i = 0; i < acceptedAnswers.length; i++)
		{
			let accepted = acceptedAnswers[i].trim().toLowerCase();
			console.log(accepted.slice(0,-1))
			console.log(ans)
			if(accepted.endsWith('*') && accepted.slice(0,-1) === ans)
			{
				this.setState({score: this.state.score + curValue, correct: true});
				break;
			}
			else if(ans.includes(accepted))
			{
				this.setState({score: this.state.score + curValue, correct: true});
				break;
			}
		}
		this.forceUpdate();
	}
	
	render()
	{
		// make sure we have stored the data from the text file into
		// the squares
		if(this.state.qas === "")
		{
			this.handleText();
		}
		
		const qas = this.state.qas;
		
		return (
			<div className="App">
				<header className="App-header">
					<br />
					<p className="title">TRIVIA</p>
				</header>
				{this.state.qas ? (
					<div className="gameboard">
					{show === "grid" ? (
						<div className="gridview">
							<div className="questiongrid" onClick={() => this.handleGridClick()}>
								<Row rownum="-1" value="100" qas={qas.slice(0,5)}/>
								<Row rownum="0" value="100" qas={qas.slice(5,20)}/>
								<Row rownum="1" value="200" qas={qas.slice(20,35)}/>
								<Row rownum="2" value="300" qas={qas.slice(35,50)}/>
								<Row rownum="3" value="400" qas={qas.slice(50,65)}/>
								<Row rownum="4" value="500" qas={qas.slice(65,80)}/>
							</div>
							<br />
							{gridArray.toString() === [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]].toString() ? (
								<p className="scoreDisplay">Final Score: {this.state.score}</p>
							) : (
								<p className="scoreDisplay">Current Score: {this.state.score}</p>
							)}
						</div>
					) : ( show === "question" ? (
						<div className="questionview">
							<div className="question-panel border border-3 border-dark">
								<p>{curQuestion}</p>
							</div>
							<br />
							<div>
								<input id="questionInput" className="questionInput form-control inline" type="text"></input>
								<button className="btn btn-secondary submit-button inline" onClick={() => this.submitAnswer()}>Submit</button>
							</div>
						</div>
					) : (
						<div className="answerview">
							<div className="answer-heading border border-3 border-dark">
								{this.state.correct ? (
									<p>CORRECT!</p>
								) : (
									<p>INCORRECT</p>
								)}
							</div>
							<button className="link-button" onClick={() => this.handlePanelClick()}>
							<div className="answer-panel border border-3 border-dark">
								<p>{curAnswer}</p>
							</div></button>
						</div>
					))}
					</div>
				) : (
					<p>Loading...</p>
				)}
			</div>
		);
	}
}

export default App;
