
import java.io.File;
import java.io.IOException;
import java.util.Iterator;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

/**
 * Servlet implementation class FileUploda
 */
@WebServlet(urlPatterns = { "/FileUpload.do" })
public class FileUpload extends HttpServlet {
	
	private String savePath = "D:/Program Files (x86)/Neon_Eclipse/workspace/websocketServer/WebContent/music/";
	
	public FileUpload() {
		super();
		// TODO Auto-generated constructor stub
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		request.setCharacterEncoding("utf-8");  
        response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache");  
        boolean result = fileUpload(request,response);
		response.getWriter().print(result);

	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

	private boolean fileUpload(HttpServletRequest request, HttpServletResponse response){
		try {
			int sizeThreshold = 1024 * 64; 
			File repositoryFile = new File(savePath);
			FileItemFactory factory = new DiskFileItemFactory(sizeThreshold, repositoryFile);
			ServletFileUpload upload = new ServletFileUpload(factory);
			upload.setHeaderEncoding("utf-8"); // 設定編碼
			upload.setSizeMax(10 * 1024 * 1024); // set every upload file'size
			// less than 5M
			java.util.List<FileItem> items = (java.util.List<FileItem>) upload.parseRequest(request); // 執行上傳
			Iterator<FileItem> iter = items.iterator();
			
			while (iter.hasNext()) {
				FileItem item = (FileItem) iter.next(); // FileItem就是表示一个表單域。
				if (!item.isFormField()) {
					String fileName = item.getName(); // 返回文件在client端上的文件名。e.g:
					if(fileName.endsWith(".mp3") == true){
						// 保存的圖片名稱
						File uploadedFile = new File(savePath + fileName);
						item.write(uploadedFile);
						System.out.println("=== upLoad Success ===");
						request.setAttribute("picname", fileName);
					}else{
						return false;
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return true;
	}
}
