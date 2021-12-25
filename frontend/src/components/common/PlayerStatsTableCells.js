import TableCell from '@mui/material/TableCell';

const PlayerStatsTableCells = ({ position, row }) => {
  switch (position) {
    case 'QB':
      return (
        <>
          <TableCell align='right'>{row.gamesPlayed}</TableCell>
          <TableCell align='right'>{row.passingAttempts}</TableCell>
          <TableCell align='right'>{row.passingYards}</TableCell>
          <TableCell align='right'>{row.passingTouchdowns}</TableCell>
          <TableCell align='right'>{row.interceptions}</TableCell>
          <TableCell align='right'>{row.rushingYards}</TableCell>
          <TableCell align='right'>{row.rushingTouchdowns}</TableCell>
          <TableCell align='right'>{row.passingFumbles}</TableCell>
        </>
      );
    case 'RB':
      return (
        <>
          <TableCell align='right'>{row.gamesPlayed}</TableCell>
          <TableCell align='right'>{row.rushingAttempts}</TableCell>
          <TableCell align='right'>{row.rushingYards}</TableCell>
          <TableCell align='right'>{row.rushingTouchdowns}</TableCell>
          <TableCell align='right'>{row.receptions}</TableCell>
          <TableCell align='right'>{row.rushingYards}</TableCell>
          <TableCell align='right'>{row.receivingYards}</TableCell>
          <TableCell align='right'>{row.rushingFumbles}</TableCell>
        </>
      );
    case 'WR':
      return (
        <>
          <TableCell align='right'>{row.gamesPlayed}</TableCell>
          <TableCell align='right'>{row.receptions}</TableCell>
          <TableCell align='right'>{row.receivingYards}</TableCell>
          <TableCell align='right'>{row.receivingTouchdowns}</TableCell>
          <TableCell align='right'>{row.rushingAttempts}</TableCell>
          <TableCell align='right'>{row.rushingYards}</TableCell>
          <TableCell align='right'>{row.rushingTouchdowns}</TableCell>
          <TableCell align='right'>{row.receivingFumbles}</TableCell>
        </>
      );
    case 'TE':
      return (
        <>
          <TableCell align='right'>{row.gamesPlayed}</TableCell>
          <TableCell align='right'>{row.receptions}</TableCell>
          <TableCell align='right'>{row.receivingYards}</TableCell>
          <TableCell align='right'>{row.receivingTouchdowns}</TableCell>
          <TableCell align='right'>{row.rushingAttempts}</TableCell>
          <TableCell align='right'>{row.rushingYards}</TableCell>
          <TableCell align='right'>{row.rushingTouchdowns}</TableCell>
          <TableCell align='right'>{row.receivingFumbles}</TableCell>
        </>
      );
    default:
      return null;
  }
};

export default PlayerStatsTableCells;
