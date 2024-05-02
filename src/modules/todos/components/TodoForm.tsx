import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import React, { SyntheticEvent, forwardRef } from "react";
import { Assignee } from "../../assignees/models/Assignee";
import { Todo, TodoLabelEnum, TodoPriorityEnum } from "../models/Todo";
import { toCalendarDate } from "../../../utils";

export type AssigneeAutoCompleteType = Assignee & { label: string };

export const toAssigneeAutoCompleteType = (
  a: Assignee
): AssigneeAutoCompleteType => ({ ...a, label: a.name });

export const toAssignee = (a: AssigneeAutoCompleteType): Assignee => {
  const { label, ...assignee } = a;
  return assignee;
};

interface Props {
  onSubmit: (data: Partial<Todo>) => void;
  errorMessage?: string;
  defaultValue?: Todo | null;
  assignees: AssigneeAutoCompleteType[];
}

const TodoForm = forwardRef(
  ({ onSubmit, errorMessage, defaultValue, assignees }: Props, ref) => {
    const [priority, setPriority] = React.useState("");
    const [labels, setLabels] = React.useState<string[]>([]);

    const {
      control,
      register,
      handleSubmit,
      reset,
      setValue,
      // trigger,
      formState: { errors },
    } = useForm<Partial<Todo>>({
      defaultValues:
        {
          ...defaultValue,
          startDate: defaultValue?.startDate
            ? toCalendarDate(new Date(defaultValue.startDate))
            : undefined,

          labels: [TodoLabelEnum.CSS],
          completed: true,
        } || {},
    });

    React.useEffect(() => {
      if (!defaultValue) return;
      // console.log("defaultValue: ", defaultValue);
      setLabels(defaultValue.labels);
      setPriority(defaultValue.prority);
    }, [defaultValue]);

    const handleChange = (event: SelectChangeEvent) => {
      setPriority(event.target.value);
      // console.log("Value: ", event.target.value);
    };

    const handleLabelsChange = (event: SelectChangeEvent<string[]>) => {
      setLabels(event.target.value as string[]);
      // console.log("Value: ", event.target.value);
    };

    const handleAssigneeChange = (
      //@ts-ignore
      event: SyntheticEvent<Element, Event>,
      value: AssigneeAutoCompleteType | null
    ) => {
      if (value) {
        setValue("assignee", toAssignee(value));
        // trigger("assignee");
      }
    };

    // console.log(defaultValue);

    // React.useEffect(() => {
    //   defaultValue?.gender && setGender(defaultValue.gender);
    // }, [defaultValue?.gender]);

    const submitBtnRef = React.useRef<HTMLButtonElement>(null);

    // React.useEffect(() => {
    //   const values = defaultValue;
    //   delete values?.id;
    //   for (const key in values) {
    //     setValue(key, values[key]);
    //   }
    // }, [defaultValue]);

    React.useImperativeHandle(ref, () => ({
      triggerSubmit: () => {
        submitBtnRef.current?.click();
      },
      resetForm: () => {
        reset();
      },
    }));

    const handleFormSubmit: SubmitHandler<Partial<Todo>> = (data) => {
      onSubmit(data);
      // reset();
    };

    return (
      <div style={{ minWidth: "400px" }}>
        {errorMessage && (
          <Box marginBottom={2}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box marginBottom={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="title"
                  type="text"
                  {...register("title", {
                    required: {
                      value: true,
                      message: "Le titre est requis.",
                    },
                    minLength: {
                      value: 3,
                      message: "Le titre doit avoir au moins 3 charactères",
                    },
                  })}
                  error={Boolean(errors.title)}
                  helperText={errors.title ? errors.title.message : ""}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box marginBottom={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="description"
                  type="textarea"
                  minRows={3}
                  {...register("description", {
                    required: {
                      value: true,
                      message: "La description est requis.",
                    },
                    minLength: {
                      value: 3,
                      message:
                        "La description doit avoir au moins 3 charactères",
                    },
                  })}
                  error={Boolean(errors.description)}
                  helperText={
                    errors.description ? errors.description.message : ""
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={Boolean(errors.prority)}>
                <InputLabel id="prority-select-label">prority</InputLabel>
                <Select
                  labelId="prority-select-label"
                  id="prority-select"
                  {...register("prority", {
                    required: {
                      value: true,
                      message: "La priorité est requise.",
                    },
                  })}
                  label="prority"
                  value={priority || ""}
                  onChange={handleChange}>
                  <MenuItem value={TodoPriorityEnum.LOW}>Low</MenuItem>
                  <MenuItem value={TodoPriorityEnum.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={TodoPriorityEnum.HIGHT}>Hight</MenuItem>
                </Select>
                {errors.prority && (
                  <FormHelperText>{errors.prority.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={Boolean(errors.labels)}>
                <InputLabel id="labels-select-label">Labels</InputLabel>
                <Select
                  labelId="labels-select-label"
                  id="labels-select"
                  multiple
                  {...register("labels", {
                    required: {
                      value: true,
                      message: "Les labels sont requis.",
                    },
                  })}
                  label="labels"
                  value={labels}
                  onChange={handleLabelsChange}>
                  <MenuItem value={TodoLabelEnum.CSS}>CSS</MenuItem>
                  <MenuItem value={TodoLabelEnum.HTML}>HTML</MenuItem>
                  <MenuItem value={TodoLabelEnum.JQUERY}>JQuery</MenuItem>
                  <MenuItem value={TodoLabelEnum.NODEJS}>Node.js</MenuItem>
                </Select>
                {errors.labels && (
                  <FormHelperText>{errors.labels.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="startDate"
                control={control}
                // defaultValue=""
                render={({ field }) => (
                  <TextField
                    fullWidth
                    {...field}
                    label="start Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.startDate}
                    helperText={
                      errors.startDate ? errors.startDate.message : ""
                    }
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              {/* <CustomAutoComplete<Assignee> data={assignees} label="Assignee" /> */}

              {/* <Autocomplete
                {...register("assignee", {
                  required: {
                    value: true,
                    message: "The assignee is required",
                  },
                })}
                id="country-select-demo"
                sx={{ width: "100%" }}
                options={countries}
                autoHighlight
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                    key={option.code}>
                    <img
                      loading="lazy"
                      width="20"
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      alt=""
                    />
                    {option.label} ({option.code}) +{option.phone}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a country"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              /> */}
              <FormControl fullWidth error={Boolean(errors.assignee)}>
                <Autocomplete
                  {...register("assignee", {
                    required: {
                      value: true,
                      message: "Assignee is required",
                    },
                  })}
                  options={assignees}
                  defaultValue={
                    defaultValue?.assignee
                      ? toAssigneeAutoCompleteType(defaultValue.assignee)
                      : undefined
                  }
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      error={!!errors.assignee}
                      {...params}
                      label="Choisissez un pays"
                    />
                  )}
                  onChange={handleAssigneeChange}
                />

                {errors.assignee && (
                  <FormHelperText>{errors.assignee.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="completed"
                control={control}
                // defaultValue={true}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={!!defaultValue?.completed}
                      />
                    }
                    label="Completed"
                  />
                )}
              />
            </Grid>
          </Grid>

          <Button
            ref={submitBtnRef}
            style={{ display: "none" }}
            type="submit"
            variant="contained"
            color="primary">
            Submit
          </Button>
        </form>
      </div>
    );
  }
);

export default TodoForm;
