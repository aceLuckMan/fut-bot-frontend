import React, { useState, useEffect } from 'react'
import { useNavigate  } from "react-router-dom";

import { SERVER_URL } from '@/config';
import { Card,CardHeader, CardBody, Typography, Alert, Chip, Dialog, DialogHeader, DialogBody,
          DialogFooter, Input, Button, Select,Option, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
import toast, { Toaster } from 'react-hot-toast';
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {useCounterStore} from "@/Store";
registerLocale('es', es)
export function User() {
  let navigate  = useNavigate ();
  const token = localStorage.getItem("authToken");
  if(!token||token=="") navigate('/auth/sign-in')
  //page
  const [active, setActive] = React.useState(1);
  const [pagesize, setPagesize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  
  const getItemProps = (index) =>
    ({
      variant: active === index ? "filled" : "text",
      color: active === index ? "blue" : "blue-gray",
      onClick: () => setActive(index),
      className: "rounded-full",
    })
 
  const next = () => {
    if (active === pagination1.totalPages) return;
 
    setActive(active + 1);
  };
 
  const prev = () => {
    if (active === 1) return;
 
    setActive(active - 1);
  };
  //end
  const getUserList = useCounterStore(state => state.getUserList)

  const pagination1 = useCounterStore(state => state.pagination1)
  const userlist = pagination1.docs

  const [enDate, setEnDate] = useState(new Date());
  const [month, setMonth1] = useState('');
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    name:"",
    email:"",
    endDate:"",
    password:"",
    _id:0
  });
  var dt;
  const handleSearch = (e) =>{
    setSearch(e.target.value)
  }
  const handleSelect = (e) =>{
    setMonth1(e);
    dt = new Date();
    if(e==0){
      dt.setTime(dt.getTime()+3*3600000)
    }
    else{
      dt.setMonth(dt.getMonth()+Number(e))
    }
    setEnDate(dt);
    console.log(dt.toLocaleString());
  }
  const handleOpen = (open,n) => {
    setMonth1('')
    setOpen(open);
    if(n==0){
      setUser({
        name:"",
        email:"",
        endDate:"",
        password:"",
        _id:0
      })
      setEnDate(new Date())
    }
    else {
      setUser({
        name:userlist[n-1].name,
        email:userlist[n-1].email,
        endDate:userlist[n-1].endDate,
        password:userlist[n-1].password,
        _id:userlist[n-1]._id
      })
      setEnDate(new Date(userlist[n-1].endDate))
    }
  };
  const saveUser = (e) =>{
        e.preventDefault();
        if(!user.email){
          toast.error("email required")
          return;
        }
        if(!user.name){
          toast.error("name required")
          return;
        }
        if(!user.password){
          toast.error("password required")
          return;
        }
        user.endDate = enDate.toLocaleString();
        console.log(user.endDate);
        if(user._id==0)
          axios.post(`${SERVER_URL}/user/createUser`, user)
          .then(res=> {
            if(res.data.success==true)
              toast.success(res.data.message)
            else 
              toast.error(res.data.message)
              getUserList(active,pagesize,search)
              }
            )
        else 
          axios.put(`${SERVER_URL}/user/editUser/${user._id}`, user)
          .then(res=> {
            if(res.data.success==true)
              toast.success(res.data.message)
            else 
              toast.error(res.data.message)
            getUserList(active,pagesize,search)
              }
            )
        handleOpen(false,0);
  }
  const removeUser = (userId) =>{
    axios.delete(`${SERVER_URL}/user/deleteUser/${userId}`)
    .then(res=> {
      if(res.data.success==true)
        toast.success(res.data.message)
      else 
        toast.error(res.data.message)
      getUserList(active,pagesize,search)

        }
      )
    handleOpen(false,0);
  }
    useEffect(() => {
        getUserList(active,pagesize,search)
    }, [active,pagesize,search])
    const Pager = []
    for(let i=1; i<=pagination1.totalPages;i++){
      Pager.push( <IconButton key={i} {...getItemProps(i)}>{i}</IconButton>)
    }
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="green" className="mb-8 p-4 grid grid-cols-4 gap-4">
          <Typography variant="h6" color="white">
            Users Table
          </Typography>
          <div></div>
          <div>
             <Input type="search" label="Search" value={search} onChange={handleSearch}/>
          </div>
          <Button variant="text" className='text-white' onClick={()=>handleOpen(true,0)}>Add User</Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["no", "name", "email", "password", "create on", "endDate"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-10 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {
            userlist&&userlist.length>0?
            userlist.map((item,n) => {
              if(item.email.search(search)>-1) 
                return (
                    <tr className='hover:bg-slate-100' onClick={() => handleOpen(true,n+1)} key={n}>
                        <td className='p-4 border-b border-blue-gray-50  px-10'><Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {n+1}
                            </Typography></td>
                        <td className='p-4 border-b border-blue-gray-50  px-10'><Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {item.name}
                            </Typography>
                          </td>
                        <td className='p-4 border-b border-blue-gray-50  px-10'>
                          <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {item.email}
                          </Typography>
                        </td>
                        <td className='p-4 border-b border-blue-gray-50 px-10'>
                          {item.name!="admin"?item.password:"******"}
                        </td>
                        <td className='p-4 border-b border-blue-gray-50 px-10'>
                          {new Date(item.createdOn).toLocaleString()}
                        </td>
                        <td className='p-4 border-b border-blue-gray-50 px-10'>
                          {item.name!="admin"?new Date(item.endDate).toLocaleString():""}
                        </td>
                    </tr>
                    )
                }):
                <tr>
                  <td  className='text-center text-2xl p-4' colSpan={6}>
                     Empty Data
                  </td>
                </tr>
              }
            </tbody>
          </table>
          <div className="flex items-center p-3 gap-4">
              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center gap-2 rounded-full"
                onClick={prev}
                disabled={active === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Pager}
              </div>
              <Button
                variant="text"
                color="blue-gray"
                className="flex items-center gap-2 rounded-full"
                onClick={next}
                disabled={active === 5}
              >
                Next
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </div>
        </CardBody>
      </Card>
      <Dialog open={open} handler={() => handleOpen(false,0)} size='sm'>
        <DialogHeader>User Option</DialogHeader>
        <DialogBody divider className='flex flex-col gap-4'>
            <Input label="Name" size="md" 
                   onChange={(e)=>setUser(user=>{return{...user,name:e.target.value}})}
                   value={user.name}/>
            <Input type="email" 
                   label="Email" size="md" 
                   onChange={(e)=>setUser(user=>{return{...user,email:e.target.value}})}
                   value={user.email}/>
            <Input type="password" 
                   label="Password" size="md" 
                   onChange={(e)=>setUser(user=>{return{...user,password:e.target.value}})}
                   value={user.password}/>
           
            <div className='flex p-15'>
              <Select label="Select Period" className='flex-2' 
              onChange={e=>handleSelect(e)} value={month}>
                  <Option value='0'>3 Hours</Option>
                  <Option value='1'>1 Month</Option>
                  <Option value='3'>3 Months</Option>
                  <Option value='6'>6 Months</Option>
              </Select>
              <DatePicker  className='flex-1 p-2' 
              selected={enDate} 
              onChange={(date) => setEnDate(date)} 
              // showTimeSelect
              />
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/>
            
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="amber" onClick={() => handleOpen(false,0)} className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button color="red" onClick={() => removeUser(user._id)} className="mr-1">
            <span>Remove</span>
          </Button>
          
          <Button variant="gradient" color="green" onClick={saveUser}>
            <span>Save</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Toaster />
    </div>
  );
}

export default User;
