import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

const PlayerRankingsModal = (props) => {
  const intialState = {
    name: null,
    num_qbs: 20,
    num_rbs: 50,
    num_wrs: 50,
    num_tes: 20,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(intialState);
  const history = useHistory();
  const {
    className,
    modal,
    setModal,
    user,
    rankingsLists,
    addRankingsList,
    setActiveListSetup,
  } = props;

  useEffect(() => {}, []);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const toggle = () => setModal(!modal);

  const validate = () => {
    const { name, num_qbs, num_rbs, num_wrs, num_tes } = formData;
    if (!name) {
      alert('List name is required.');
      return true;
    }
    if (num_qbs > 20) {
      alert('A maximum of 20 QBs can be ranked.');
      return true;
    }
    if (num_qbs < 5) {
      alert('A minimum of 5 QBs can be ranked.');
      return true;
    }
    if (num_rbs > 50) {
      alert('A maximum of 50 RBs can be ranked.');
      return true;
    }
    if (num_rbs < 5) {
      alert('A minimum of 5 RBs can be ranked.');
      return true;
    }
    if (num_wrs > 50) {
      alert('A maximum of 20 WRs can be ranked.');
      return true;
    }
    if (num_wrs < 5) {
      alert('A minimum of 5 WRs can be ranked.');
      return true;
    }
    if (num_tes > 20) {
      alert('A maximum of 20 TEs can be ranked.');
      return true;
    }
    if (num_tes < 5) {
      alert('A minimum of 5 TEs can be ranked.');
      return true;
    }
    return false;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      setIsLoading(true);
      if (validate()) {
        setIsLoading(false);
        return;
      }
      const newRankingsList = await addRankingsList({
        setIsLoading,
        list: {
          ...formData,
          user_id: Number(user.id),
        },
      });
      newRankingsList.isNew = true;

      // getUserRankingsLists({ setIsLoading, userId: user.id });
      setActiveListSetup(newRankingsList);
      setIsLoading(false);
      setFormData(intialState);
      toggle();
      history.push(`/my-rankings/${newRankingsList.id}`);
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };
  return (
    <Modal isOpen={modal} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle}>New rankings list:</ModalHeader>
      <ModalBody>
        <div className='col-md-11 m-auto'>
          <Form className='search-form mt-2'>
            <FormGroup>
              <Label htmlFor='name'>List name:</Label>
              <Input
                id='name'
                name='name'
                placeholder='List name (e.g. Rankings list 1)'
                required
                value={formData.name}
                onChange={handleChange}
              />
            </FormGroup>
            <p className='mt-3 mb-1'>
              Number of players to rank at each position:
            </p>
            <FormGroup className='col-2'>
              <Label htmlFor='num_qbs'>QB:</Label>
              <Input
                id='num_qbs'
                name='num_qbs'
                type='number'
                required
                value={formData.num_qbs}
                onChange={handleChange}
                min={5}
                max={20}
              />
            </FormGroup>
            <FormGroup className='col-2'>
              <Label htmlFor='num_rbs'>RB:</Label>
              <Input
                id='num_rbs'
                name='num_rbs'
                type='number'
                required
                value={formData.num_rbs}
                onChange={handleChange}
                min={5}
                max={50}
              />
            </FormGroup>
            <FormGroup className='col-2'>
              <Label htmlFor='num_wrs'>WR:</Label>
              <Input
                id='num_wrs'
                name='num_wrs'
                type='number'
                required
                value={formData.num_wrs}
                onChange={handleChange}
                min={5}
                max={50}
              />
            </FormGroup>
            <FormGroup className='col-2'>
              <Label htmlFor='num_tes'>TE:</Label>
              <Input
                id='num_tes'
                name='num_tes'
                type='number'
                required
                value={formData.num_tes}
                onChange={handleChange}
                min={5}
                max={20}
              />
            </FormGroup>
          </Form>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={toggle}>
          Cancel
        </Button>
        <Button color='primary' onClick={handleSubmit}>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapDispatch = (dispatch) => {
  return {
    addRankingsList: dispatch.players.addRankingsListsAsync,
  };
};

const mapState = (state) => {
  return {
    rankingsLists: state.players.rankingsLists,
  };
};

export default connect(mapState, mapDispatch)(PlayerRankingsModal);
