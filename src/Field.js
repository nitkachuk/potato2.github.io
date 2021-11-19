import React from 'react';
import Card from './Card';
import GameInfo from './GameInfo';

class Field extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        cards: [],
        pairs: [],
        card_open_1: null,
        card_open_2: null,
		timer: 0,
		score: 0,
      }
  }
  
  tick() {
	  this.setState(state => ({
		 timer: state.timer + 1, 
	  }));
  }

// запускается перед отображением компонента

  componentDidMount() {
	  
	// создаем массивы карт и пар
	
    const cards = [];
    const pairs = [];
	
    for (let i = 0; i < this.props.pairs; i++) {
      cards.push(i);
      cards.push(i);
      pairs.push(false);
    }
	
	// перемешиваем
    cards.sort(() => 0.5 - Math.random());
	
	
	// запускаем таймер
	
	this.timerInterval = setInterval( () => this.tick(), 1000 );

	// сохраняем массивы в state 

    this.setState({
      cards: cards,
      pairs: pairs,
    });
  }

  pickCard(i) {
	// если нажимаем на ту же каточку или уже открыта вторая карточка
	// то игнорируем нажатие
	
    if ( this.state.card_open_1 === i || this.state.card_open_2 != null )
      return;

	// если первая карта еще не выбрана 
	// значит только что щелкнули по первой карте
	// мы ее открываем и запускаем таймер до открытия
	
    if (this.state.card_open_1 === null) {
      this.setState({
        card_open_1: i,
      });
	  this.closeTimer = setTimeout( () => this.closePair(), 1000 );
      return;
    }
  
	// если первая карта уже выбрана 
	// значит сейчас щелкнули по второй карте 
	// мы ее открываем и запускаем таймер до открытия 
	
	//узнаем номера пар первой и второй выбранных карт 
	
    const pair_number_1 = this.state.cards[this.state.card_open_1];
    const pair_number_2 = this.state.cards[i];
	
	// удаляем предыдущий таймер на закрытие карт (если он есть) 
	  
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
      }

	// если обе карты из одной пары
	
    if (pair_number_1 === pair_number_2) {
	  
	  // запускаем таймер на удаление пары с поля
      setTimeout(() => this.removePair(pair_number_1), 1000);
	  
    } else {
	  
	  // запускаем новый таймер на закрытие 
      this.closeTimer = setTimeout(() => this.closePair(), 1000);
    }


	// открываем вторую карту
    this.setState({
      card_open_2: i,
    });
  }

  closePair() {
    this.setState({
      card_open_1: null,
      card_open_2: null,
    });
  }

  removePair(n) {
    const pairs = [...this.state.pairs];
	
	// отмечаем пару убранной
    pairs[n] = true;
	
	// если убрали последнюю пару
	if( this.state.score + 1 >= this.props.pairs ) { 
		clearInterval( this.timerInterval );	// останавливаем таймер
	}
	
	
	// обновляем в state массив пар, закрываем карты, 
	// увеличиваем score 
	
    this.setState(prevState => ({
      pairs: pairs,
      card_open_1: null,
      card_open_2: null,
	  score: prevState.score + 1,
    }));
  }

  render() {
      return (
		  <>
		  <div className="status-bar">
			<GameInfo content={this.state.timer} />
			<GameInfo content={this.state.score} />
		  </div>
          <div className="field">
            {this.state.cards.map((n, i) => (
              <Card
                key={i}
                pair={n}
				removed={this.state.pairs[n]}
                open={this.state.card_open_1 === i || this.state.card_open_2 === i}
                onClick={() => this.pickCard(i)}
              />
            ))}
          </div>
		 </>
      );
  }
}

export default Field;
