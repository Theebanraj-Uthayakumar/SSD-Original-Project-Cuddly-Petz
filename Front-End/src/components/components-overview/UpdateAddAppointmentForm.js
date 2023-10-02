import React from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormGroup,
  // FormCheckbox,
  FormSelect,
  Button,  
  FormTextarea,  
  InputGroupText,
  InputGroupAddon,
  InputGroup
} from "shards-react";

class AddAppointmentForm extends React.Component {

  constructor(props) {
    super(props);

    this.params = new URLSearchParams(window.location.search);
    
    this.state = {
      // Fourth list of posts.
      HID:'',
      DID: '',
      POID: '',
      PID: '',
      TypeReason: '',
      Date: '',
      Time: '',
      Fee: '',
      RoomNo: '',
      Status: '',
      Note: '',
      File : '',
      HospitalDetails:[],
      DoctorsDetails:[],
      PetOwnerDetails:[],
      PetDetails:[]
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateAppoinmentsDetails = this.updateAppoinmentsDetails.bind(this);
    this.loadPetDetails = this.loadPetDetails.bind(this);
    // this.ConfirmOrder = this.ConfirmOrder.bind(this);
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.id;

    this.setState({
      [name]: value
    });
  }

  updateAppoinmentsDetails = (event) => {

    const { 
      HID, 
      DID, 
      POID,
      PID,
      TypeReason,
      Date,
      Time,
      Fee,
      RoomNo,
      Note,
      File } = this.state;
    
    
    // var today = new Date();
    // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var appointmentdata = { 
      Note: Note,
      File: File 
    };

    if(HID === "" || DID === "" || POID === "" || PID === "" || TypeReason === "" || Date === "" || Time === "" || Note === "" || Fee === "" || RoomNo === ""){
      alert("Please fill all required fields");
    }else{
        
      fetch('https://cuddly-petz-backend-be41f8744064.herokuapp.com/api/v1/appointment/'+this.params.get("appID"), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentdata)
      })
      .then(response => response.json())
      .then(data => {
        alert('Successfully Appointment Note Added');      
        window.location.reload();
      })
      .catch(error => {
        console.error('Error making appointment:', error);
      });

    }

  }

  componentDidMount() {
    fetch('https://cuddly-petz-backend-be41f8744064.herokuapp.com/api/v1/doctor')
    .then((response) => response.json())
    .then(doctorList => {
        this.setState({ DoctorsDetails: doctorList });
        //console.log(doctorList);
    });

    fetch('https://cuddly-petz-backend-be41f8744064.herokuapp.com/api/v1/petowners/')
    .then((response) => response.json())
    .then(petownerList => {
        this.setState({ PetOwnerDetails: petownerList });
        //console.log(petownerList);
    });

    fetch('https://cuddly-petz-backend-be41f8744064.herokuapp.com/api/v1/pethospital/')
    .then((response) => response.json())
    .then(pethospitalList => {
        this.setState({ HospitalDetails: pethospitalList });
        //console.log(pethospitalList);
    });

    fetch('https://cuddly-petz-backend-be41f8744064.herokuapp.com/api/v1/appointment/'+this.params.get("appID"))
    .then((response) => response.json())
    .then(appointmentEditDetails => {
        this.setState({ HID: appointmentEditDetails.HID });
        this.setState({ DID: appointmentEditDetails.DID });
        this.setState({ POID: appointmentEditDetails.POID });
        this.setState({ PID: appointmentEditDetails.PID });
        this.setState({ TypeReason: appointmentEditDetails.TypeReason });
        this.setState({ Date: appointmentEditDetails.Date });
        this.setState({ Time: appointmentEditDetails.Time });
        this.setState({ Fee: appointmentEditDetails.Fee });
        this.setState({ RoomNo: appointmentEditDetails.RoomNo });
        this.setState({ Status: appointmentEditDetails.Status });
        this.setState({ Note: appointmentEditDetails.Note });
        this.setState({ File: appointmentEditDetails.File });
    });
    
  }

  loadPetDetails(PetOwnerID)
  {
    this.setState({ POID: PetOwnerID });
    fetch('https://cuddly-petz-backend-be41f8744064.herokuapp.com/api/v1/pet/?where={"PetOwnerID":}'+PetOwnerID)
    .then((response) => response.json())
    .then(petList => {
        this.setState({ PetDetails: petList });
        //console.log(petList);
    });
  }

  render() 
  {
  const {
    HospitalDetails,
    DoctorsDetails,
    PetOwnerDetails,
    PetDetails
  } = this.state;
  return(
  <ListGroup flush>
    <ListGroupItem className="p-3">
      <Row>
        <Col>
          <Form>
            <Row form>

            <Col md="6" className="mb-3">
                <label htmlFor="DSpecialty">Hospital New</label>                
                <FormSelect id="HID" 
                    value={this.state.HID}
                    onChange={this.handleChange} disabled={true}>     
                    <option value="0">Choose a Hospital</option>
                    {HospitalDetails.map((post, idx) => (
                      <option key={post._id} value={post._id}>{post.HName}</option>  
                    ))
                    }
                </FormSelect>
              </Col>

              <Col md="6" className="mb-3">
                <label htmlFor="DSpecialty">Doctor</label>                
                <FormSelect id="DID" disabled={true}
                    value={this.state.DID}
                    onChange={this.handleChange}>                      
                    <option value="0">Choose a Doctor</option>
                    {DoctorsDetails.map((post, idx) => (
                      <option key={post._id}  value={post._id}>{post.DFirstName} {post.DLastName}</option>  
                    ))
                    }
                </FormSelect>
              </Col>

              <Col md="6" className="mb-3">
                <label id="POID" htmlFor="DSpecialty">Pet Owner</label>
                <FormSelect disabled={true}
                                value={this.state.POID}
                                onChange={(e)=>{this.loadPetDetails(e.target.value)}}>
                    <option value="0">Choose a Pet Owner</option>
                    {PetOwnerDetails.map((post, idx) => (
                      <option key={post._id}  value={post._id}>{post.OFirstName} {post.OLastName}</option>  
                    ))
                    }
                </FormSelect>
              </Col>

              <Col md="6" className="mb-3">
                <label htmlFor="DSpecialty">Pet</label>                
                <FormSelect id="PID" disabled={true}
                                value={this.state.PID}
                                onChange={this.handleChange}>
                    <option value="0">Choose a Pet</option>
                    {PetDetails.map((post, idx) => (
                      <option key={post._id}  value={post._id}>{post.PetName}</option>  
                    ))
                    }
                </FormSelect>
              </Col>


              <Col md="6" className="form-group">
                <label htmlFor="Date">Appointment Date</label>
                <FormInput disabled={true}
                  id="Date"
                  type="date"
                  value={this.state.Date}
                  onChange={this.handleChange}
                />
              </Col>

              <Col md="6" className="form-group">
                <label htmlFor="Time">Time</label>
                <FormInput disabled={true}
                  id="Time"
                  type="time"
                  value={this.state.Time}
                  onChange={this.handleChange}
                />
              </Col>    

              <Col md="6" className="form-group">
                <label htmlFor="feInputCategory">Appointment Fee</label>
                <InputGroup>
                  <InputGroupAddon type="prepend">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <FormInput  id="Fee" 
                  value={this.state.Fee}
                  onChange={this.handleChange} disabled={true}/>
                  <InputGroupAddon type="append">
                    <InputGroupText>.00</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>

              <Col md="6" className="form-group">
                <label htmlFor="Time">Room No</label>
                <FormInput
                  id="RoomNo"
                  type="number"
                  placeholder="Room No"
                  disabled={true}
                  value={this.state.RoomNo}
                  onChange={this.handleChange}
                />
              </Col>

            </Row>


            <Row form>              
              <Col md="12">   
              <FormGroup>
                <label htmlFor="feInputTypeReason">Reason</label>
                <FormTextarea id="TypeReason"                 
                value={this.state.TypeReason}
                disabled={true}
                onChange={this.handleChange} placeholder="Tell Something about pet your condition..." />
              </FormGroup>
              </Col>
            </Row>
            
            <Row form>              
              <Col md="12">   
              <FormGroup>
                <label htmlFor="feInputTypeReason">Note</label>
                <FormTextarea id="Note"                 
                value={this.state.Note}
                onChange={this.handleChange} placeholder="Write a Note..." />
              </FormGroup>
              </Col>
            </Row>
            
            <Row form>              
              <Col md="12">   
              <FormGroup>
                <label htmlFor="feInputTypeReason">File</label>
                <FormInput id="File" type="url"               
                value={this.state.File}
                onChange={this.handleChange} placeholder="Enter your file url" />
              </FormGroup>
              </Col>
            </Row>

            <Button onClick={this.updateAppoinmentsDetails}>Add New Note</Button>
          </Form>
        </Col>
      </Row>
    </ListGroupItem>
  </ListGroup>
  );
}
};

export default AddAppointmentForm;
