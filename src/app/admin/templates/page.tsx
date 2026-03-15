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
   Stack,
   Card,
   Chip,
   Tooltip as MuiTooltip,
   Grid,
} from '@mui/material';
import { 
   Plus, 
   Trash2, 
   Edit3, 
   FileText, 
   Globe, 
   Building2, 
   Eye, 
   Code, 
   CheckCircle2,
   ChevronLeft,
} from 'lucide-react';
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
      if (confirm('Are you sure you want to permanently delete this template?')) {
         deleteTemplate.mutate(id);
      }
   };

   const getClinicName = (template: any) => {
      if (template.is_global) return <Chip icon={<Globe size={12} />} label="Global" size="small" sx={{ bgcolor: '#F0F7FF', color: '#2F5FA5', fontWeight: 800, fontSize: '10px' }} />;
      if (!Array.isArray(clinics) || !template.clinic_id) return <Typography variant="caption" color="textSecondary">Assign Clinic</Typography>;
      const clinic = clinics.find((c: any) => c._id === template.clinic_id);
      return clinic ? clinic.name : 'Unknown Clinic';
   };

   const isLoading = loadingClinics || loadingTemplates;

   return (
      <Box maxWidth="xl" mx="auto">
         <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            mb={5}
            flexWrap="wrap"
            gap={2}>
            <Box>
               <Typography
                  variant='h4'
                  fontWeight='800'
                  color="primary"
                  gutterBottom>
                  Dynamic Blueprints
               </Typography>
               <Typography variant='body1' color='text.secondary'>
                  Architect custom PDF layouts for invoices, parchis, and clinical reports.
               </Typography>
            </Box>
            <Button
               variant='contained'
               startIcon={<Plus size={18} />}
               onClick={() => setOpen(true)}
               sx={{ borderRadius: '12px', height: 48, px: 3 }}>
               Draft New Blueprint
            </Button>
         </Box>

         {isLoading ?
            <Box display="flex" justifyContent="center" py={10}>
               <CircularProgress thickness={4} />
            </Box>
         :  <Card sx={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(15, 23, 42, 0.05)', overflow: 'hidden', border: '1px solid #E3EEF7' }}>
               <TableContainer>
                  <Table>
                     <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                        <TableRow>
                           <TableCell sx={{ fontWeight: '700', color: '#64748B', py: 2 }}>BLUEPRINT NAME</TableCell>
                           <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>DOCUMENT TYPE</TableCell>
                           <TableCell sx={{ fontWeight: '700', color: '#64748B' }}>SCOPE</TableCell>
                           <TableCell align='right' sx={{ fontWeight: '700', color: '#64748B' }}>ACTIONS</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {Array.isArray(templates) && templates.length > 0 ?
                           templates.map((template: any) => (
                              <TableRow key={template._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                 <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                       <Box sx={{ p: 1, bgcolor: '#F1F5F9', borderRadius: '8px', color: '#2F5FA5' }}>
                                          <FileText size={18} />
                                       </Box>
                                       <Typography variant='subtitle2' fontWeight='700' color="#0F172A">
                                          {template.template_name}
                                       </Typography>
                                    </Stack>
                                 </TableCell>
                                 <TableCell>
                                    <Chip 
                                       label={template.template_type?.replace('_', ' ')} 
                                       size="small" 
                                       sx={{ 
                                          textTransform: 'uppercase', 
                                          fontWeight: 800, 
                                          fontSize: '10px',
                                          bgcolor: '#F1F5F9',
                                          color: '#475569'
                                       }} 
                                    />
                                 </TableCell>
                                 <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                       {getClinicName(template)}
                                    </Stack>
                                 </TableCell>
                                 <TableCell align='right'>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                       <IconButton
                                          size="small"
                                          color='primary'
                                          onClick={() => handleOpenEdit(template)}
                                          sx={{ bgcolor: '#F0F7FF' }}>
                                          <Edit3 size={16} />
                                       </IconButton>
                                       <IconButton
                                          size="small"
                                          color='error'
                                          onClick={() => handleDelete(template._id)}
                                          sx={{ bgcolor: '#FEF2F2' }}>
                                          <Trash2 size={16} />
                                       </IconButton>
                                    </Stack>
                                 </TableCell>
                              </TableRow>
                           ))
                        :  <TableRow>
                              <TableCell colSpan={4} align='center' sx={{ py: 10 }}>
                                 <Box sx={{ opacity: 0.2, mb: 2 }}>
                                    <FileText size={64} />
                                 </Box>
                                 <Typography variant='h6' color='text.secondary' fontWeight="700">No Blueprints Defined</Typography>
                                 <Typography variant='body2' color='text.secondary'>Create a document template to enable PDF generation.</Typography>
                              </TableCell>
                           </TableRow>
                        }
                     </TableBody>
                  </Table>
               </TableContainer>
            </Card>
         }

         {/* Blueprint Editor Dialog */}
         <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='md'
            PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Typography variant="h5" fontWeight="800">{editingId ? 'Refine Blueprint' : 'Architect New Blueprint'}</Typography>
               <Tabs
                  value={tabIndex}
                  onChange={(e, val) => setTabIndex(val)}
                  sx={{ 
                     '& .MuiTabs-indicator': { height: 3, borderRadius: '3px' },
                     '& .MuiTab-root': { fontWeight: 800, fontSize: '13px' }
                  }}>
                  <Tab icon={<Code size={16} />} iconPosition="start" label='Structure' />
                  <Tab icon={<Eye size={16} />} iconPosition="start" label='Simulation' />
               </Tabs>
            </DialogTitle>
            <DialogContent dividers sx={{ borderTop: '1px solid #F1F5F9' }}>
               {tabIndex === 0 && (
                  <Stack spacing={3} sx={{ pt: 2 }}>
                     <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                           <TextField
                              autoFocus
                              name='template_name'
                              label='Blueprint Designation'
                              fullWidth
                              value={formData.template_name}
                              onChange={handleChange}
                              InputProps={{ sx: { borderRadius: '12px' } }}
                           />
                        </Grid>
                        <Grid item xs={12} md={6}>
                           <FormControl fullWidth>
                              <InputLabel>Document Protocol</InputLabel>
                              <Select
                                 name='template_type'
                                 value={formData.template_type}
                                 label='Document Protocol'
                                 onChange={handleChange}
                                 sx={{ borderRadius: '12px' }}>
                                 <MenuItem value='invoice'>Financial Invoice</MenuItem>
                                 <MenuItem value='medical_parchi'>Clinical Parchi</MenuItem>
                                 <MenuItem value='receipt'>Payment Receipt</MenuItem>
                              </Select>
                           </FormControl>
                        </Grid>
                     </Grid>

                     <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E3EEF7' }}>
                        <FormControlLabel
                           control={
                              <Switch
                                 checked={formData.is_global}
                                 onChange={handleChange}
                                 name='is_global'
                                 color="primary"
                              />
                           }
                           label={<Typography fontWeight="700" color="#0F172A">Universal Scope (Global)</Typography>}
                        />
                        <Typography variant="caption" color="textSecondary" display="block" sx={{ ml: 6 }}>
                           Enable this to make the blueprint accessible across all clinic instances.
                        </Typography>
                     </Box>

                     {!formData.is_global && (
                        <FormControl fullWidth>
                           <InputLabel>Target Clinic Instance</InputLabel>
                           <Select
                              name='clinic_id'
                              value={formData.clinic_id}
                              label='Target Clinic Instance'
                              onChange={handleChange}
                              sx={{ borderRadius: '12px' }}>
                              {Array.isArray(clinics) &&
                                 clinics.map((c: any) => (
                                    <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                                 ))}
                           </Select>
                        </FormControl>
                     )}

                     <TextField
                        name='html_content'
                        label='HTML Schematic'
                        fullWidth
                        multiline
                        rows={12}
                        value={formData.html_content}
                        onChange={handleChange}
                        helperText='Inject raw HTML/CSS for granular PDF layout control.'
                        InputProps={{ 
                           sx: { 
                              borderRadius: '16px', 
                              fontFamily: 'JetBrains Mono, monospace', 
                              fontSize: '13px',
                              bgcolor: '#FBFCFE'
                           } 
                        }}
                     />
                  </Stack>
               )}

               {tabIndex === 1 && (
                  <Box sx={{ pt: 2 }}>
                     <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                        Real-time visualization of the blueprint structure before final rendering.
                     </Typography>
                     <Paper
                        elevation={0}
                        sx={{
                           p: 4,
                           borderRadius: '20px',
                           border: '1px solid #E3EEF7',
                           minHeight: 500,
                           backgroundColor: '#fff',
                           boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.02)'
                        }}>
                        <div
                           dangerouslySetInnerHTML={{
                              __html:
                                 formData.html_content ||
                                 '<div style="text-align: center; color: #94A3B8; padding-top: 100px;">No schematic data provided</div>',
                           }}
                        />
                     </Paper>
                  </Box>
               )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
               <Button onClick={handleClose} sx={{ color: '#64748B', fontWeight: 700 }}>Dismiss</Button>
               <Button
                  onClick={handleSave}
                  variant='contained'
                  disabled={createTemplate.isPending || updateTemplate.isPending}
                  sx={{ borderRadius: '12px', px: 4, fontWeight: 700 }}>
                  {createTemplate.isPending || updateTemplate.isPending ?
                     <CircularProgress size={24} color="inherit" />
                  :  'Commit Changes'}
               </Button>
            </DialogActions>
         </Dialog>
      </Box>
   );
}
