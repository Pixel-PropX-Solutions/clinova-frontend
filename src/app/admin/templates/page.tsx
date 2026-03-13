'use client';

import React, { useState } from 'react';
import {
   Box,
   Button,
   Typography,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   TextField,
   CircularProgress,
   MenuItem,
   Select,
   InputLabel,
   FormControl,
   IconButton,
   FormControlLabel,
   Switch,
   Tabs,
   Tab,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useClinics } from '@/hooks/api/useClinics';
import {
   useAdminTemplates,
   useCreateAdminTemplate,
   useUpdateAdminTemplate,
   useDeleteAdminTemplate,
} from '@/hooks/api/useTemplates';

export default function AdminTemplatesPage() {
   const { data: clinics, isLoading: loadingClinics } = useClinics();
   const { data: templates, isLoading: loadingTemplates } = useAdminTemplates();
   const createTemplate = useCreateAdminTemplate();
   const updateTemplate = useUpdateAdminTemplate();
   const deleteTemplate = useDeleteAdminTemplate();

   const [open, setOpen] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [formData, setFormData] = useState({
      template_name: '',
      template_type: 'invoice',
      html_content: '',
      clinic_id: '',
      is_global: false,
   });

   const [tabIndex, setTabIndex] = useState(0);

   const handleClose = () => {
      setOpen(false);
      setEditingId(null);
      setFormData({
         template_name: '',
         template_type: 'invoice',
         html_content: '',
         clinic_id: '',
         is_global: false,
      });
      setTabIndex(0);
   };

   const handleOpenEdit = (template: any) => {
      setFormData({
         template_name: template.template_name,
         template_type: template.template_type,
         html_content: template.html_content,
         clinic_id: template.clinic_id || '',
         is_global: template.is_global || false,
      });
      setEditingId(template._id);
      setOpen(true);
   };

   const handleChange = (e: any) => {
      const { name, value, checked, type } = e.target;
      setFormData({
         ...formData,
         [name]: type === 'checkbox' ? checked : value,
      });
   };

   const handleSave = () => {
      if (editingId) {
         updateTemplate.mutate(
            { id: editingId, data: formData },
            { onSuccess: handleClose },
         );
      } else {
         createTemplate.mutate(formData, { onSuccess: handleClose });
      }
   };

   const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this template?')) {
         deleteTemplate.mutate(id);
      }
   };

   const getClinicName = (template: any) => {
      if (template.is_global) return 'Global (All Clinics)';
      if (!Array.isArray(clinics) || !template.clinic_id) return 'N/A';
      const clinic = clinics.find((c: any) => c._id === template.clinic_id);
      return clinic ? clinic.name : template.clinic_id;
   };

   const isLoading = loadingClinics || loadingTemplates;

   return (
      <Box>
         <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            mb={4}>
            <Typography
               variant='h4'
               fontWeight='bold'>
               Manage Templates
            </Typography>
            <Button
               variant='contained'
               startIcon={<Add />}
               onClick={() => setOpen(true)}>
               Add Template
            </Button>
         </Box>

         {isLoading ?
            <CircularProgress />
         :  <TableContainer
               component={Paper}
               elevation={2}
               sx={{ borderRadius: 2 }}>
               <Table>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                     <TableRow>
                        <TableCell>
                           <b>Name</b>
                        </TableCell>
                        <TableCell>
                           <b>Type</b>
                        </TableCell>
                        <TableCell>
                           <b>Clinic / Client</b>
                        </TableCell>
                        <TableCell align='right'>
                           <b>Actions</b>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {Array.isArray(templates) && templates.length > 0 ?
                        templates.map((template: any) => (
                           <TableRow key={template._id}>
                              <TableCell>{template.template_name}</TableCell>
                              <TableCell sx={{ textTransform: 'capitalize' }}>
                                 {template.template_type?.replace('_', ' ')}
                              </TableCell>
                              <TableCell>{getClinicName(template)}</TableCell>
                              <TableCell align='right'>
                                 <IconButton
                                    color='primary'
                                    onClick={() => handleOpenEdit(template)}>
                                    <Edit />
                                 </IconButton>
                                 <IconButton
                                    color='error'
                                    onClick={() => handleDelete(template._id)}>
                                    <Delete />
                                 </IconButton>
                              </TableCell>
                           </TableRow>
                        ))
                     :  <TableRow>
                           <TableCell
                              colSpan={4}
                              align='center'>
                              No templates found.
                           </TableCell>
                        </TableRow>
                     }
                  </TableBody>
               </Table>
            </TableContainer>
         }

         {/* Add/Edit Template Dialog */}
         <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='md'>
            <DialogTitle>
               {editingId ? 'Edit Template' : 'Add New Template'}
            </DialogTitle>
            <DialogContent dividers>
               <Tabs
                  value={tabIndex}
                  onChange={(e, val) => setTabIndex(val)}
                  sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Tab label='Edit Info & HTML' />
                  <Tab label='Preview' />
               </Tabs>

               {tabIndex === 0 && (
                  <>
                     <TextField
                        autoFocus
                        margin='dense'
                        name='template_name'
                        label='Template Name'
                        fullWidth
                        value={formData.template_name}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                     />

                     <FormControl
                        fullWidth
                        sx={{ mb: 2 }}>
                        <InputLabel>Template Type</InputLabel>
                        <Select
                           name='template_type'
                           value={formData.template_type}
                           label='Template Type'
                           onChange={handleChange}>
                           <MenuItem value='invoice'>Invoice</MenuItem>
                           <MenuItem value='medical_parchi'>
                              Medical Parchi
                           </MenuItem>
                           <MenuItem value='receipt'>Receipt</MenuItem>
                        </Select>
                     </FormControl>

                     <FormControlLabel
                        control={
                           <Switch
                              checked={formData.is_global}
                              onChange={handleChange}
                              name='is_global'
                           />
                        }
                        label='Make Global (Available to all clinics)'
                        sx={{ mb: 2 }}
                     />

                     {!formData.is_global && (
                        <FormControl
                           fullWidth
                           sx={{ mb: 2 }}>
                           <InputLabel>Clinic / Client</InputLabel>
                           <Select
                              name='clinic_id'
                              value={formData.clinic_id}
                              label='Clinic / Client'
                              onChange={handleChange}>
                              {Array.isArray(clinics) &&
                                 clinics.map((c: any) => (
                                    <MenuItem
                                       key={c._id}
                                       value={c._id}>
                                       {c.name}
                                    </MenuItem>
                                 ))}
                           </Select>
                        </FormControl>
                     )}

                     <TextField
                        margin='dense'
                        name='html_content'
                        label='HTML Content'
                        fullWidth
                        multiline
                        rows={12}
                        value={formData.html_content}
                        onChange={handleChange}
                        helperText='Enter the raw HTML content for this template'
                     />
                  </>
               )}

               {tabIndex === 1 && (
                  <Paper
                     elevation={0}
                     sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        minHeight: 400,
                        backgroundColor: '#fff',
                     }}>
                     <div
                        dangerouslySetInnerHTML={{
                           __html:
                              formData.html_content ||
                              '<p>No content provided</p>',
                        }}
                     />
                  </Paper>
               )}
            </DialogContent>
            <DialogActions>
               <Button
                  onClick={handleClose}
                  color='inherit'>
                  Cancel
               </Button>
               <Button
                  onClick={handleSave}
                  variant='contained'
                  disabled={
                     createTemplate.isPending || updateTemplate.isPending
                  }>
                  {createTemplate.isPending || updateTemplate.isPending ?
                     <CircularProgress size={24} />
                  :  'Save'}
               </Button>
            </DialogActions>
         </Dialog>
      </Box>
   );
}
