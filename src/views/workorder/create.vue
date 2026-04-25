<template>
  <div class="workorder-create">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">新建工单</h1>
      <p class="page-desc">创建新的设备维修或保养工单</p>
      <el-button @click="$router.go(-1)">返回列表</el-button>
    </div>

    <!-- 表单 -->
    <div class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        size="default"
      >
        <!-- 基本信息 -->
        <el-card header="基本信息" class="form-card">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工单标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入工单标题" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择工单类型">
                  <el-option label="维修" value="维修" />
                  <el-option label="保养" value="保养" />
                  <el-option label="巡检" value="巡检" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="优先级" prop="priority">
                <el-select v-model="form.priority" placeholder="请选择优先级">
                  <el-option label="低" value="低" />
                  <el-option label="中" value="中" />
                  <el-option label="高" value="高" />
                  <el-option label="紧急" value="紧急" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报修人" prop="reporter">
                <el-input v-model="form.reporter" placeholder="请输入报修人姓名" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="现场地址" prop="location">
                <el-input v-model="form.location" placeholder="请输入现场地址" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 处理信息 -->
        <el-card header="处理信息" class="form-card">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="负责人" prop="assignee">
                <el-select
                  v-model="form.assignee"
                  placeholder="请选择负责人"
                  filterable
                >
                  <el-option label="李师傅" value="李师傅" />
                  <el-option label="张师傅" value="张师傅" />
                  <el-option label="王工" value="王工" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计完成时间" prop="deadline">
                <el-date-picker
                  v-model="form.deadline"
                  type="datetime"
                  placeholder="请选择预计完成时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 问题描述 -->
        <el-card header="问题描述" class="form-card">
          <el-form-item prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请详细描述问题情况"
            />
          </el-form-item>

          <!-- 图片上传 -->
          <el-form-item label="现场照片">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="handleFileChange"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
          </el-form-item>
        </el-card>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <el-button @click="$router.go(-1)">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交工单
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)
const dialogVisible = ref(false)
const dialogImageUrl = ref('')

// 表单数据
const form = reactive({
  title: '',
  type: '维修',
  priority: '中',
  reporter: '',
  phone: '',
  location: '',
  assignee: '',
  deadline: '',
  description: '',
  images: []
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入工单标题', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择工单类型', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  reporter: [
    { required: true, message: '请输入报修人姓名', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入问题描述', trigger: 'blur' },
    { min: 10, message: '描述至少需要10个字符', trigger: 'blur' }
  ]
}

// 图片上传相关
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const handleRemove = (file) => {
  const index = form.images.indexOf(file.url)
  if (index !== -1) {
    form.images.splice(index, 1)
  }
}

const handleFileChange = (file) => {
  // 模拟上传成功，获取URL
  const url = URL.createObjectURL(file.raw)
  form.images.push(url)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    // 表单验证
    await formRef.value.validate()

    submitting.value = true

    // 模拟提交
    setTimeout(() => {
      submitting.value = false
      ElMessage.success('工单创建成功')
      router.push('/workorder/list')
    }, 1500)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.workorder-create {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .page-title {
      margin: 0;
    }
  }

  .form-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .form-card {
    margin-bottom: 20px;

    :deep(.el-card__header) {
      padding: 15px 20px;
      font-weight: 500;
      background-color: #f8f9fa;
    }
  }

  .form-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 30px;
  }
}

// 响应式
@media (max-width: 768px) {
  .workorder-create {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .form-container {
      padding: 0 10px;
    }
  }
}
</style>