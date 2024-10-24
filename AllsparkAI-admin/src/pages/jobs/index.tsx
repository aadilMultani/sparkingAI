import { fontFamily } from 'theme/typography';
import { useState, ChangeEvent, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import DateSelect from 'components/dates/DateSelect';
import IconifyIcon from 'components/base/IconifyIcon';
import { getApi } from 'service/GlobleApi';
// import Splash from 'components/loading/Splash';
// import CommonModal from 'components/modal/Modal';
import { useDispatch } from 'react-redux';
import { fetchCities, fetchCountries, fetchRoles, fetchStates } from 'redux/action/dropdown';
import CommonModal from 'components/modal/Modal';
import JobsModal from './jobsModal';
import UsersTable from './jobsTable';
import Splash from 'components/loading/Splash';

const Jobs = () => {
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const [jobsdata, setJobsdata] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getApi('get-jobCart')
      .then((res: any) => {
        setJobsdata(res.data);
      })
      .catch((error: any) => {
        console.error("Error fetching client data:", error);
      });

    fetchCountries(dispatch);
    fetchStates(dispatch);
    fetchCities(dispatch);
    fetchRoles(dispatch);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleModel = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Paper sx={{ px: 0 }}>
      <Stack
        px={3.5}
        spacing={1.5}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          flexGrow={1}
        >
          <Typography variant="h6" fontWeight={400} fontFamily={fontFamily.workSans}>
            Jobs List
          </Typography>
          <TextField
            variant="filled"
            size="small"
            placeholder="Search for..."
            value={searchText}
            onChange={handleInputChange}
            sx={{ width: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ cursor: 'pointer' }}>
                  <IconifyIcon icon={'mingcute:search-line'} onClick={() => console.log("'bla bla")} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack
          spacing={1.5}
          direction={{ xs: 'column-reverse', sm: 'row' }}
          alignItems={{ xs: 'flex-end', sm: 'center' }}
        >
          <DateSelect />
          <Button variant="contained" size="small" onClick={handleModel}>
            Create Jobs
          </Button>
          {open && <CommonModal
            open={open}
            Component={<JobsModal
              heading='Create Jobs'
              onClose={handleClose}
              jobsdata={jobsdata}
              setJobsdata={setJobsdata}
            />}
          />}
        </Stack>
      </Stack>

      {/* Display Client Data Table  */}
      {jobsdata && Array.isArray(jobsdata) && jobsdata.length > 0 ? (
        <UsersTable
          jobsdata={jobsdata}
          setJobsdata={setJobsdata}
          searchText={searchText}
        />
      ) : (
        <Splash />
      )}
    </Paper>
  );
};

export default Jobs;