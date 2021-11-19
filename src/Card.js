import React from 'react';

class Card extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="card">
                {!this.props.removed && (this.props.open
                    ? <img src={`/cards/${this.props.pair % 18 + 1}.png`} alt="card" />
                    : <img src='/cards/shirt.png' alt="card" />
                )}
            </div>
        )
    }
}

export default Card;
