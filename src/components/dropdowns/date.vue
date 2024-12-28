<script setup lang="ts">
import { ref, computed, inject, watchEffect, onMounted } from "vue";
import { uuid } from "vue-uuid";
import moment from "moment";
import { IArrowDown } from "../../core/icons";
import ButtonLightBlue from "../../components/buttons/ButtonLightBlue.vue";

// props
const props = defineProps<{ data: { year: string; month: string } }>();
// variables

const numDate = ref<any[]>([]);
const currentDay = ref();
const selectedDay = ref<{ value: string; id: string }>({ value: "", id: "" });
const trailings = ref<number>(0);
// computed

const maxDate = computed(() => {
  const selectedDate = moment(`${props.data.year}-${props.data.month}`);
  const month = selectedDate.month();

  if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
    return 31;
  } else if ([3, 5, 8, 10].includes(month)) {
    return 30;
  } else {
    return 28;
  }
});

// hooks
onMounted(() => {
  currentDay.value = moment().date();
  numDate.value.map((date) => {
    if (date.value === currentDay.value && date.out !== true) {
      const curr = document.getElementById(date.id);
      curr!.classList.add(
        "bg-[#003b3d]",
        "rounded-[20%]",
        "px-3",
        "cursor-pointer",
        "flex",
        "items-center",
        "justify-center"
      );
      curr!.style.color = "white";
      selectedDay.value.value = curr!.innerHTML;
      selectedDay.value.id = date.id;
    }
  });
});

// methods

const selectDay = (id: string, out: boolean) => {
  // check if previous selected date exists

  if (out == false) {
    const prev = document.getElementById(selectedDay.value.id);
    const curr = document.getElementById(id);
    // remove previous styling

    if (prev) {
      prev!.classList.remove(
        "bg-[#003b3d]",
        "rounded-[20%]",
        "px-3",
        "cursor-pointer",
        "flex",
        "items-center",
        "justify-center"
      );
      prev!.style.color = "black";
    }

    curr!.classList.add(
      "bg-[#003b3d]",
      "rounded-[20%]",
      "px-3",
      "cursor-pointer",
      "flex",
      "items-center",
      "justify-center"
    );
    curr!.style.color = "white";
    selectedDay.value.value = curr!.innerHTML;
    selectedDay.value.id = id;
    // if (prev?.classList.contains("bg-blue rounded-lg  p-1")) {
    //   prev.classList.remove("bg-blue", "rounded-lg", " p-1");
    // }
  }
};
const getLastDayOfPreviousMonth = () => {
  const dte = moment(`${props.data.year}-${props.data.month}`)
    .subtract(1, "months")
    .endOf("month")
    .format("YYYY-MM-DD");
  return dte.split("-")[2];
};

const getFirstWeekDay = () => {
  const day = moment(1, "DD").toString().split(" ")[0];
  switch (day) {
    case "Mon":
      currentDay.value = 2;
      break;
    case "Tue":
      currentDay.value = 3;
      break;
    case "Wed":
      currentDay.value = 4;
      break;
    case "Thu":
      currentDay.value = 5;
      break;
    case "Fri":
      currentDay.value = 6;
      break;
    case "Sat":
      currentDay.value = 7;
      break;
    default:
      1;
  }
};
const getTrailings = () => {
  const day = moment(`${props.data.year}-${props.data.month}`)
    .toString()
    .split(" ")[0];
  switch (day) {
    case "Mon":
      trailings.value = 1;
      break;
    case "Tue":
      trailings.value = 2;
      break;
    case "Wed":
      trailings.value = 3;
      break;
    case "Thu":
      trailings.value = 4;
      break;
    case "Fri":
      trailings.value = 5;
      break;
    case "Sat":
      trailings.value = 6;
      break;
    default:
      0;
  }
};

const computeDate = () => {
  for (
    let i = parseInt(getLastDayOfPreviousMonth()) - (trailings.value - 1);
    i <= parseInt(getLastDayOfPreviousMonth());
    i++
  ) {
    numDate.value.push({
      value: i,
      color: "text-grey-rgba",
      out: true,
      id: uuid.v4(),
    });
  }
  for (let i = 1; i <= maxDate.value; i++) {
    numDate.value.push({
      value: i,
      color: "text-black",
      out: false,
      id: uuid.v4(),
    });
  }

  for (let i = 1; numDate.value.length < 35; i++) {
    numDate.value.push({
      value: i,
      color: "text-grey-rgba",
      out: true,
      id: uuid.v4(),
    });
  }
};
const compileDate = () => {
  getFirstWeekDay();
  getTrailings();
  computeDate();
};
// create dateem
compileDate();

// watcher
watchEffect(() => {
  numDate.value.length = 0;
  compileDate();
});
// provide and inject
const showMonth = inject("showMonth");
const showYear = inject("showYear");

// watcher
</script>
<template>
  <div class="space-y-5 p-6 shadow-rgba bg-white font-bold rounded-lg">
    <div class="flex space-x-5 text-sm">
      <div class="flex">
        <ButtonLightBlue color="text-[#003b3d]" @click="showYear = !showYear">
          <template v-slot:placeholder>{{ props.data.year }}</template>
          <template v-slot:icon>
            <IArrowDown />
          </template>
        </ButtonLightBlue>
      </div>
      <div class="flex">
        <ButtonLightBlue color="text-[#003b3d]" @click="showMonth = !showMonth">
          <template v-slot:placeholder>{{ props.data.month }}</template>
          <template v-slot:icon> <IArrowDown /> </template
        ></ButtonLightBlue>
      </div>
    </div>
    <!-- date -->
    <div class="space-y-5">
      <div class="grid grid-cols-7 text-center text-sm font-normal gap-5">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      <div class="text-sm grid text-center grid-cols-7 font-normal gap-5">
        <span
          @click="selectDay(date.id, date.out)"
          :id="date.id"
          v-for="date in numDate"
          :key="date"
          :class="date.color"
          >{{ date.value }}</span
        >
        <!-- <span
          v-for="date in numDate"
          :key="date"
          :class="
            moment(selectedDate).day() == date &&
            'bg-blue rounded-md py-1 px-1 cursor-pointer text-white text-center'
          "
          >{{ date }}</span
        > -->
      </div>
    </div>
  </div>
</template>

<style></style>
