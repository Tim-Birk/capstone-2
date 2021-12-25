import React from 'react';
import { POSITIONS } from '../../helpers';
import './PrintableCheatSheet.css';

const positionArray = ['QB', 'RB', 'WR', 'TE'];
class PrintableCheatSheet extends React.Component {
  render() {
    const { activeList, list } = this.props;
    return (
      <div className='cheat-sheet-container'>
        <h3 className='cheat-sheet-title'>Fantasy Rankings Assistant</h3>
        <h5 className='cheat-sheet-subtitle'>
          Your personal rankings cheat sheet: {list.name}
        </h5>
        <div className='cheat-sheet-content'>
          {positionArray.map((position) => {
            return (
              <ol className='position-list'>
                <h6 className='position-title'>{POSITIONS[position].name}</h6>
                {activeList[position].positionResults.map((r) => (
                  <li>{r.player_name}</li>
                ))}
              </ol>
            );
          })}
        </div>
      </div>
    );
  }
}

export default PrintableCheatSheet;
