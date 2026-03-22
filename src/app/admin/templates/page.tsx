'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
   Grid,
   useTheme,
   useMediaQuery,
} from '@mui/material';
import {
   Plus,
   Trash2,
   Edit3,
   FileText,
   Globe,
   Eye,
   Code,
} from 'lucide-react';
import { useClinics } from '@/hooks/api/useClinics';
import {
   useAdminTemplates,
   useCreateAdminTemplate,
   useUpdateAdminTemplate,
   useDeleteAdminTemplate,
} from '@/hooks/api/useTemplates';

export default function AdminTemplatesPage() {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

   const { data: clinics, isLoading: loadingClinics } = useClinics();
   const { data: templates, isLoading: loadingTemplates } = useAdminTemplates();
   const createTemplate = useCreateAdminTemplate();
   const updateTemplate = useUpdateAdminTemplate();
   const deleteTemplate = useDeleteAdminTemplate();

   const previewContainerRef = useRef<HTMLDivElement | null>(null);
   const [previewFrameSize, setPreviewFrameSize] = useState({ width: 1024, height: 1320 });
   const [previewScale, setPreviewScale] = useState(1);
   const scaledPreviewWidth = previewFrameSize.width * previewScale;
   const scaledPreviewHeight = previewFrameSize.height * previewScale;

   const [open, setOpen] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [formData, setFormData] = useState({
      template_name: '',
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
         html_content: '',
         clinic_id: '',
         is_global: false,
      });
      setTabIndex(0);
   };

   const handleOpenEdit = (template: any) => {
      setFormData({
         template_name: template.template_name,
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

   const recalculatePreviewScale = useCallback(() => {
      const container = previewContainerRef.current;
      if (!container) return;

      const widthScale = container.clientWidth / previewFrameSize.width;
      const heightScale = container.clientHeight / previewFrameSize.height;
      const nextScale = Math.min(1, widthScale, heightScale);

      if (Number.isFinite(nextScale) && nextScale > 0) {
         setPreviewScale(nextScale);
      }
   }, [previewFrameSize.height, previewFrameSize.width]);

   useEffect(() => {
      recalculatePreviewScale();
   }, [recalculatePreviewScale]);

   useEffect(() => {
      const container = previewContainerRef.current;
      if (!container) return;

      const observer = new ResizeObserver(() => {
         recalculatePreviewScale();
      });

      observer.observe(container);
      return () => observer.disconnect();
   }, [recalculatePreviewScale]);

   const handlePreviewLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
      const iframe = event.currentTarget;
      const doc = iframe.contentDocument;
      if (!doc) return;

      const root = doc.documentElement;
      const body = doc.body;

      const contentWidth = Math.max(
         root?.scrollWidth || 0,
         root?.offsetWidth || 0,
         body?.scrollWidth || 0,
         body?.offsetWidth || 0,
      );
      const contentHeight = Math.max(
         root?.scrollHeight || 0,
         root?.offsetHeight || 0,
         body?.scrollHeight || 0,
         body?.offsetHeight || 0,
      );

      if (contentWidth > 0 && contentHeight > 0) {
         setPreviewFrameSize({ width: contentWidth, height: contentHeight });
      }
   };
   const isLoading = loadingClinics || loadingTemplates;

   return (
      <Box maxWidth="xl" mx="auto">
         <Box
            display='flex'
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            mb={{ xs: 3, md: 5 }}
            gap={2}>
            <Box>
               <Typography
                  variant='h4'
                  fontWeight='800'
                  color="primary"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                  Dynamic Blueprints
               </Typography>
               <Typography variant='body1' color='text.secondary' sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                  Architect custom PDF layouts for invoices, receipts, and clinical reports.
               </Typography>
            </Box>
            <Button
               variant='contained'
               fullWidth={isMobile}
               startIcon={<Plus size={18} />}
               onClick={() => setOpen(true)}
               sx={{ borderRadius: '12px', height: 48, px: { xs: 2, sm: 3 } }}>
               Draft New Blueprint
            </Button>
         </Box>

         {isLoading ?
            <Box display="flex" justifyContent="center" py={10}>
               <CircularProgress thickness={4} />
            </Box>
            : <Card sx={{ borderRadius: { xs: '16px', sm: '24px' }, boxShadow: '0 10px 40px rgba(15, 23, 42, 0.05)', overflow: 'hidden', border: '1px solid #E3EEF7' }}>
               <TableContainer>
                  <Table>
                     <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                        <TableRow>
                           <TableCell sx={{ fontWeight: '700', color: '#64748B', py: 2, fontSize: { xs: '11px', sm: '12px' } }}>BLUEPRINT NAME</TableCell>
                           {!isTablet && <TableCell sx={{ fontWeight: '700', color: '#64748B', fontSize: { xs: '11px', sm: '12px' } }}>SCOPE</TableCell>}
                           <TableCell align='right' sx={{ fontWeight: '700', color: '#64748B', fontSize: { xs: '11px', sm: '12px' } }}>ACTIONS</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {Array.isArray(templates) && templates.length > 0 ?
                           templates.map((template: any) => (
                              <TableRow key={template._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                 <TableCell>
                                    <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
                                       <Box sx={{ p: 1, bgcolor: '#F1F5F9', borderRadius: '8px', color: '#2F5FA5', display: { xs: 'none', sm: 'block' } }}>
                                          <FileText size={18} />
                                       </Box>
                                       <Box>
                                          <Typography variant='subtitle2' fontWeight='700' color="#0F172A" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                             {template.template_name}
                                          </Typography>
                                          {isMobile && (
                                             <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 0.5, textTransform: 'uppercase', fontWeight: 700, fontSize: '9px' }}>
                                                {template.template_type?.replace('_', ' ')}
                                             </Typography>
                                          )}
                                       </Box>
                                    </Stack>
                                 </TableCell>
                               
                                 {!isTablet && (
                                    <TableCell>
                                       <Stack direction="row" spacing={1} alignItems="center">
                                          {getClinicName(template)}
                                       </Stack>
                                    </TableCell>
                                 )}
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
                           : <TableRow>
                              <TableCell colSpan={isTablet ? (isMobile ? 2 : 3) : 4} align='center' sx={{ py: 10 }}>
                                 <Box sx={{ opacity: 0.1, mb: 2 }}>
                                    <FileText size={isMobile ? 48 : 64} />
                                 </Box>
                                 <Typography variant='h6' color='text.secondary' fontWeight="700" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>No Blueprints Defined</Typography>
                                 <Typography variant='body2' color='text.secondary' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Create a document template to enable PDF generation.</Typography>
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
            fullScreen={isTablet}
            maxWidth='md'
            PaperProps={{ sx: { borderRadius: isTablet ? 0 : '24px', p: { xs: 0, sm: 1 } } }}>
            <DialogTitle sx={{
               display: 'flex',
               flexDirection: { xs: 'column', sm: 'row' },
               justifyContent: 'space-between',
               alignItems: isTablet ? 'flex-start' : 'center',
               gap: 2,
               pb: 1
            }}>
               <Typography variant={isTablet ? "h6" : "h5"} fontWeight="800">
                  {editingId ? 'Refine Blueprint' : 'Architect New Blueprint'}
               </Typography>
               <Tabs
                  value={tabIndex}
                  onChange={(e, val) => setTabIndex(val)}
                  variant={isTablet ? "fullWidth" : "standard"}
                  sx={{
                     'width': isMobile ? '100%' : 'auto',
                     '& .MuiTabs-indicator': { height: 3, borderRadius: '3px' },
                     '& .MuiTab-root': { fontWeight: 800, fontSize: '13px', minHeight: 48 }
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
                           p: { xs: 1.5, sm: 4 },
                           borderRadius: '20px',
                           border: '1px solid #E3EEF7',
                           minHeight: { xs: 300, sm: 500 },
                           height: { xs: 400, sm: 560, md: 720, lg: 820 },
                           backgroundColor: '#fff',
                           boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.02)',
                           overflowX: 'auto'
                        }}>
                        <Box
                           ref={previewContainerRef}
                           sx={{
                              flexGrow: 1,
                              p: { xs: 1, sm: 3 },
                              display: 'flex',
                              height: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              bgcolor: '#E2E8F0',
                              overflow: 'hidden',
                           }}>

                           {isTablet ? (
                              <Box
                                 sx={{
                                    width: scaledPreviewWidth,
                                    height: scaledPreviewHeight,
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                 }}>
                                 <Paper
                                    elevation={4}
                                    sx={{
                                       width: previewFrameSize.width,
                                       height: previewFrameSize.height,
                                       position: 'absolute',
                                       top: 0,
                                       left: '50%',
                                       borderRadius: '8px',
                                       overflow: 'scroll',
                                       backgroundColor: 'white',
                                       transform: `translateX(-50%) scale(${previewScale})`,
                                       transformOrigin: 'top center',
                                    }}>
                                    <iframe
                                       title={formData.template_name}
                                       srcDoc={formData.html_content}
                                       onLoad={handlePreviewLoad}
                                       style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: 'white' }}
                                    />
                                 </Paper>
                              </Box>
                           ) : (
                              <Paper
                                 elevation={4}
                                 sx={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    backgroundColor: 'white',
                                 }}>
                                 <iframe
                                    title={formData.template_name}
                                    srcDoc={formData.html_content}
                                    style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: 'white' }}
                                 />
                              </Paper>
                           )}
                        </Box>
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
                     : 'Commit Changes'}
               </Button>
            </DialogActions>
         </Dialog>
      </Box>
   );
}
