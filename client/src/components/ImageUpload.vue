<template>
  <div>
    <!-- slot for parent component to activate the file changer -->
    <div @click="launchFilePicker()">
      <slot name="activator"></slot>
    </div>
    <!-- image input: style is set to hidden and assigned a ref so that it can be triggered -->
    <input type="file"
       ref="file"
       :name="uploadFieldName"
       @change="onFileChange(
          $event.target.name, $event.target.files)"
       style="display:none">
    <!-- error dialog displays any potential error messages -->
    <div class="dialog" v-if="errorDialog" max-width="300">
      <div class="card">
        <p class="subheading">{{errorText}}</p>
        <div>
            <div></div>
          <mdbBtn @click="errorDialog = false" flat>Got it!</mdbBtn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// MDB STYLING IMPORTS
import mdbBtn from 'mdbvue/lib/components/mdbBtn';

export default {
  name: 'ImageUpload',
  components: {
    mdbBtn,
  },
  data: () => ({
    errorDialog: null,
    errorText: '',
    uploadFieldName: 'file',
    maxSize: 4096,
  }),
  props: {
    // Use "value" to enable using v-model
    value: Object,
    backgroundImage: null,
  },
  methods: {
    launchFilePicker() {
      this.$refs.file.click();
    },
    async onFileChange(fieldName, file) {
      const imageFile = file[0];
      if (file.length > 0) {
        const size = imageFile.size / this.maxSize / this.maxSize;
        if (!imageFile.type.match('image.*')) {
          // check whether the upload is an image
          this.errorDialog = true;
          this.errorText = 'Please choose an image file';
        } else if (size > 1) {
          // check whether the size is greater than the size limit
          this.errorDialog = true;
          this.errorText = 'Your file is too big! Please select an image under 4MB';
        } else {
          let data = new FormData();
          data.append('image', imageFile);
          let url = await fetch('http://127.0.0.1:3000/api/image', {
            method: 'POST',
            credentials: 'include',
            body: data,
          });
          // emit event to update backgroundImage in parent component
          this.$emit('update:backgroundImage', url);
        }
      }
    },
  },
};
</script>
