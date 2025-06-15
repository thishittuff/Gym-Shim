package com.example.excelreader;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {
    private static final int REQUEST_CODE_PICK_FILE = 1;
    private static final int REQUEST_CODE_STORAGE_PERMISSION = 2;
    
    private Button selectFileButton;
    private ListView columnsListView;
    private ArrayAdapter<String> adapter;
    private List<String> columnsList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        initializeViews();
        setupClickListeners();
        checkPermissions();
    }

    private void initializeViews() {
        selectFileButton = findViewById(R.id.selectFileButton);
        columnsListView = findViewById(R.id.columnsListView);
        
        columnsList = new ArrayList<>();
        adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, columnsList);
        columnsListView.setAdapter(adapter);
    }

    private void setupClickListeners() {
        selectFileButton.setOnClickListener(v -> openFilePicker());
    }

    private void checkPermissions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) 
            != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, 
                new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, 
                REQUEST_CODE_STORAGE_PERMISSION);
        }
    }

    private void openFilePicker() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        
        // Also allow .xls files
        String[] mimeTypes = {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel"
        };
        intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
        
        startActivityForResult(Intent.createChooser(intent, "Select Excel File"), REQUEST_CODE_PICK_FILE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == REQUEST_CODE_PICK_FILE && resultCode == RESULT_OK && data != null) {
            Uri uri = data.getData();
            if (uri != null) {
                readExcelFile(uri);
            }
        }
    }

    private void readExcelFile(Uri uri) {
        try {
            InputStream inputStream = getContentResolver().openInputStream(uri);
            
            if (inputStream == null) {
                showToast("Unable to open file");
                return;
            }
            Workbook workbook;
            String fileName = uri.getLastPathSegment();
            if (fileName != null && fileName.toLowerCase().endsWith(".xlsx")) {
                workbook = new XSSFWorkbook(inputStream);
            } else {
                workbook = new HSSFWorkbook(inputStream);
            }
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);           
            if (headerRow == null) {
                showToast("No data found in the Excel file");
                return;
            }
            columnsList.clear();
            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                String columnName = "";
                if (headerRow.getCell(i) != null) {
                    columnName = headerRow.getCell(i).toString().trim();
                }
                if (columnName.isEmpty()) {
                    columnName = "Column " + (i + 1);
                }
                columnsList.add(columnName);
            }
            adapter.notifyDataSetChanged();
            
            showToast("Found " + columnsList.size() + " columns");
            
            // Close resources
            workbook.close();
            inputStream.close();
            
        } catch (Exception e) {
            e.printStackTrace();
            showToast("Error reading Excel file: " + e.getMessage());
        }
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, 
                                         @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == REQUEST_CODE_STORAGE_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                showToast("Permission granted");
            } else {
                showToast("Storage permission is required to read Excel files");
            }
        }
    }
}